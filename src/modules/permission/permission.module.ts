import { Module } from "medusa-extender";
import { Permission } from "./permission.entity";
import { PermissionMigration1655131601491 } from "./1655131601491-permission.migration";
import { PermissionRepository } from "./permission.repository";

@Module({
  imports: [Permission, PermissionRepository, PermissionMigration1655131601491],
})
export class PermissionModule {}
