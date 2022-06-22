import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { BaseEntity } from "@medusajs/medusa";
import { Entity as MedusaEntity } from "medusa-extender";
import { Permission } from "../permission/permission.entity";
import { Store } from "../store/store.entity";
import { User } from "../user/user.entity";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@MedusaEntity()
@Entity()
export class Role extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Index()
  @Column({ nullable: true })
  store_id: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.teamRole)
  @JoinColumn({ name: "id", referencedColumnName: "role_id" })
  users: User[];

  @ManyToOne(() => Store, (store) => store.roles)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "role");
  }
}
