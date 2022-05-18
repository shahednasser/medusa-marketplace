import { Module } from "medusa-extender";
import { Order } from "./order.entity";
import { OrderMigration1652101349791 } from "./1652101349791-order.migration";
import { OrderRepository } from "./order.repository";
import { OrderService } from "./order.service";
import { OrderSubscriber } from "./order.subscriber";

@Module({
  imports: [
    Order,
    OrderRepository,
    OrderService,
    OrderSubscriber,
    OrderMigration1652101349791,
  ],
})
export class OrderModule {}
