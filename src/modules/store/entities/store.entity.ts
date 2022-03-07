import { Entity, JoinColumn, OneToMany } from "typeorm";

import { Entity as MedusaEntity } from "medusa-extender";
import { Store as MedusaStore } from "@medusajs/medusa/dist";
import { Product } from "../../product/entities/product.entity";
import { User } from "../../user/entities/user.entity";

@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  members: User[];

  @OneToMany(() => Product, (product) => product.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  products: Product[];
}
