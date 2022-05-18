import { Entity, JoinColumn, OneToMany } from "typeorm";

import { Entity as MedusaEntity } from "medusa-extender";
import { Store as MedusaStore } from "@medusajs/medusa/dist";
import { Order } from "../order/order.entity";
import { Product } from "../product/product.entity";
import { User } from "../user/user.entity";

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  members: User[];

  @OneToMany(() => Product, (product) => product.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  orders: Order[];
}
