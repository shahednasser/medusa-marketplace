import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

import { Migration } from "medusa-extender";

@Migration()
export class UserMigration1655132360987 implements MigrationInterface {
  name = "UserMigration1655132360987";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "role_id" text;`;
    await queryRunner.query(query);

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "role",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."user" DROP COLUMN "role_id";`;
    await queryRunner.query(query);
  }
}
