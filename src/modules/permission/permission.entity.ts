import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { BaseEntity } from "@medusajs/medusa";
import { DbAwareColumn } from "@medusajs/medusa/dist/utils/db-aware-column";
import { Entity as MedusaEntity } from "medusa-extender";
import { Role } from "../role/role.entity";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@MedusaEntity()
@Entity()
export class Permission extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @ManyToMany(() => Role)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "perm");
  }
}
