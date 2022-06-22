import { Repository as MedusaRepository, Utils } from "medusa-extender";

import { EntityRepository } from "typeorm";
import { Invite } from "./invite.entity";
import { InviteRepository as MedusaInviteRepository } from "@medusajs/medusa/dist/repositories/invite";

@MedusaRepository({ override: MedusaInviteRepository })
@EntityRepository(Invite)
export class InviteRepository extends Utils.repositoryMixin<
  Invite,
  MedusaInviteRepository
>(MedusaInviteRepository) {}
