import { Module } from "medusa-extender";
import { Role } from "./role.entity";
import { RoleMigration1655131148363 } from "./1655131148363-role.migration";
import { RoleRepository } from "./role.repository";

@Module({
  imports: [Role, RoleRepository, RoleMigration1655131148363],
})
export class RoleModule {}
