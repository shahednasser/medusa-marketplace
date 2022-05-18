import { EventBusService, OrderService } from "@medusajs/medusa/dist/services";
import { LineItem, OrderStatus } from "@medusajs/medusa";

import { EntityManager } from "typeorm";
import { LineItemRepository } from "@medusajs/medusa/dist/repositories/line-item";
import { Order } from "./order.entity";
import { OrderRepository } from "./order.repository";
import { PaymentRepository } from "@medusajs/medusa/dist/repositories/payment";
import { Product } from "../product/product.entity";
import { ProductService } from "../product/product.service";
import { ShippingMethodRepository } from "@medusajs/medusa/dist/repositories/shipping-method";
import { Subscriber } from "medusa-extender";

type InjectedDependencies = {
  eventBusService: EventBusService;
  orderService: OrderService;
  orderRepository: typeof OrderRepository;
  productService: ProductService;
  manager: EntityManager;
  lineItemRepository: typeof LineItemRepository;
  shippingMethodRepository: typeof ShippingMethodRepository;
  paymentRepository: typeof PaymentRepository;
};

@Subscriber()
export class OrderSubscriber {
  private readonly manager: EntityManager;
  private readonly eventBusService: EventBusService;
  private readonly orderService: OrderService;
  private readonly orderRepository: typeof OrderRepository;
  private readonly productService: ProductService;
  private readonly lineItemRepository: typeof LineItemRepository;
  private readonly shippingMethodRepository: typeof ShippingMethodRepository;

  constructor({
    eventBusService,
    orderService,
    orderRepository,
    productService,
    manager,
    lineItemRepository,
    shippingMethodRepository,
    paymentRepository,
  }: InjectedDependencies) {
    this.eventBusService = eventBusService;
    this.orderService = orderService;
    this.orderRepository = orderRepository;
    this.productService = productService;
    this.manager = manager;
    this.lineItemRepository = lineItemRepository;
    this.shippingMethodRepository = shippingMethodRepository;
    this.eventBusService.subscribe(
      OrderService.Events.PLACED,
      this.handleOrderPlaced.bind(this)
    );

    //add handler for different status changes
    this.eventBusService.subscribe(
      OrderService.Events.CANCELED,
      this.checkStatus.bind(this)
    );
    this.eventBusService.subscribe(
      OrderService.Events.UPDATED,
      this.checkStatus.bind(this)
    );
    this.eventBusService.subscribe(
      OrderService.Events.COMPLETED,
      this.checkStatus.bind(this)
    );
  }

  private async handleOrderPlaced({ id }: { id: string }): Promise<void> {
    //create child orders
    //retrieve order
    const order: Order = await this.orderService.retrieve(id, {
      relations: [
        "items",
        "items.variant",
        "cart",
        "shipping_methods",
        "payments",
      ],
    });
    //group items by store id
    const groupedItems = {};

    for (const item of order.items) {
      const product: Product = await this.productService.retrieve(
        item.variant.product_id,
        { select: ["store_id"] }
      );
      const store_id = product.store_id;
      if (!store_id) {
        continue;
      }
      if (!groupedItems.hasOwnProperty(store_id)) {
        groupedItems[store_id] = [];
      }

      groupedItems[store_id].push(item);
    }

    const orderRepo = this.manager.getCustomRepository(this.orderRepository);
    const lineItemRepo = this.manager.getCustomRepository(
      this.lineItemRepository
    );
    const shippingMethodRepo = this.manager.getCustomRepository(
      this.shippingMethodRepository
    );

    for (const store_id in groupedItems) {
      //create order
      const childOrder = orderRepo.create({
        ...order,
        order_parent_id: id,
        store_id: store_id,
        cart_id: null,
        cart: null,
        id: null,
        shipping_methods: [],
      }) as Order;
      const orderResult = await orderRepo.save(childOrder);

      //create shipping methods
      for (const shippingMethod of order.shipping_methods) {
        const newShippingMethod = shippingMethodRepo.create({
          ...shippingMethod,
          id: null,
          cart_id: null,
          cart: null,
          order_id: orderResult.id,
        });

        await shippingMethodRepo.save(newShippingMethod);
      }

      //create line items
      const items: LineItem[] = groupedItems[store_id];
      for (const item of items) {
        const newItem = lineItemRepo.create({
          ...item,
          id: null,
          order_id: orderResult.id,
          cart_id: null,
        });
        await lineItemRepo.save(newItem);
      }
    }
  }

  public async checkStatus({ id }: { id: string }): Promise<void> {
    //retrieve order
    const order: Order = await this.orderService.retrieve(id);

    if (order.order_parent_id) {
      //retrieve parent
      const orderRepo = this.manager.getCustomRepository(this.orderRepository);
      const parentOrder = await this.orderService.retrieve(
        order.order_parent_id,
        {
          relations: ["children"],
        }
      );

      const newStatus = this.getStatusFromChildren(parentOrder);
      if (newStatus !== parentOrder.status) {
        switch (newStatus) {
          case OrderStatus.CANCELED:
            this.orderService.cancel(parentOrder.id);
            break;
          case OrderStatus.ARCHIVED:
            this.orderService.archive(parentOrder.id);
            break;
          case OrderStatus.COMPLETED:
            this.orderService.completeOrder(parentOrder.id);
            break;
          default:
            parentOrder.status = newStatus;
            parentOrder.fulfillment_status = newStatus;
            parentOrder.payment_status = newStatus;
            await orderRepo.save(parentOrder);
        }
      }
    }
  }

  public getStatusFromChildren(order: Order): string {
    if (!order.children) {
      return order.status;
    }

    //collect all statuses
    let statuses = order.children.map((child) => child.status);

    //remove duplicate statuses
    statuses = [...new Set(statuses)];

    if (statuses.length === 1) {
      return statuses[0];
    }

    //remove archived and canceled orders
    statuses = statuses.filter(
      (status) =>
        status !== OrderStatus.CANCELED && status !== OrderStatus.ARCHIVED
    );

    if (!statuses.length) {
      //all child orders are archived or canceled
      return OrderStatus.CANCELED;
    }

    if (statuses.length === 1) {
      return statuses[0];
    }

    //check if any order requires action
    const hasRequiresAction = statuses.some(
      (status) => status === OrderStatus.REQUIRES_ACTION
    );
    if (hasRequiresAction) {
      return OrderStatus.REQUIRES_ACTION;
    }

    //since more than one status is left and we filtered out canceled, archived,
    //and requires action statuses, only pending and complete left. So, return pending
    return OrderStatus.PENDING;
  }
}
