import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

import { Migration } from "medusa-extender";

@Migration()
export class PermissionMigration1655131601491 implements MigrationInterface {
  name = "PermissionMigration1655131601491";

  public async up(queryRunner: QueryRunner): Promise<void> {
    let query = `
        CREATE TABLE "permission" ("id" character varying NOT NULL, 
        "name" character varying NOT NULL, "metadata" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`;
    await queryRunner.query(query);

    await queryRunner.createPrimaryKey("permission", ["id"]);

    query = `
        CREATE TABLE "role_permissions" ("role_id" character varying NOT NULL, "permission_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`;

    await queryRunner.query(query);

    await queryRunner.createPrimaryKey("role_permissions", [
      "role_id",
      "permission_id",
    ]);

    await queryRunner.createForeignKey(
      "role_permissions",
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "role",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "role_permissions",
      new TableForeignKey({
        columnNames: ["permission_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "permission",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("role_permissions", true);
    await queryRunner.dropTable("permission", true);
  }
}
