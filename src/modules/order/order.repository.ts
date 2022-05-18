import { Repository as MedusaRepository, Utils } from "medusa-extender";

import { EntityRepository } from "typeorm";
import { OrderRepository as MedusaOrderRepository } from "@medusajs/medusa/dist/repositories/order";
import { Order } from "./order.entity";

@MedusaRepository({ override: MedusaOrderRepository })
@EntityRepository(Order)
export class OrderRepository extends Utils.repositoryMixin<
  Order,
  MedusaOrderRepository
>(MedusaOrderRepository) {}
