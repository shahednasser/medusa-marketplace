import { EntityRepository, Repository } from "typeorm";

import { Repository as MedusaRepository } from "medusa-extender";
import { Role } from "./role.entity";

@MedusaRepository()
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
