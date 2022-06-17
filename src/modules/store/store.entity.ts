import { Entity, JoinColumn, OneToMany } from "typeorm";

import { Invite } from "../invite/invite.entity";
import { Entity as MedusaEntity } from "medusa-extender";
import { Store as MedusaStore } from "@medusajs/medusa/dist";
import { Order } from "../order/order.entity";
import { Product } from "../product/product.entity";
import { Role } from "./../role/role.entity";
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

  @OneToMany(() => Invite, (invite) => invite.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  invites: Invite[];

  @OneToMany(() => Role, (role) => role.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  roles: Role[];
}
