import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { Entity as MedusaEntity } from "medusa-extender";
import { Invite as MedusaInvite } from "@medusajs/medusa";
import { Store } from "../store/store.entity";

@MedusaEntity({ override: MedusaInvite })
@Entity()
export class Invite extends MedusaInvite {
  @Index()
  @Column({ nullable: true })
  store_id: string;

  @ManyToOne(() => Store, (store) => store.invites)
  @JoinColumn({ name: "store_id" })
  store: Store;
}
