import { MigrationInterface, QueryRunner } from "typeorm";

import { Migration } from "medusa-extender";

@Migration()
export class OrderMigration1652101349791 implements MigrationInterface {
  name = "OrderMigration1652101349791";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
            ALTER TABLE public."order" ADD COLUMN IF NOT EXISTS "store_id" text; 
            ALTER TABLE public."order" ADD COLUMN IF NOT EXISTS "order_parent_id" text;
            ALTER TABLE public."order" ADD CONSTRAINT "FK_8a96dde86e3cad9d2fcc6cb171f87" FOREIGN KEY ("order_parent_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `
            ALTER TABLE public."order" DROP COLUMN "store_id";
            ALTER TABLE public."order" DROP COLUMN "order_parent_id";
            ALTER TABLE public."order" DROP FOREIGN KEY "FK_8a96dde86e3cad9d2fcc6cb171f87cb2"; 
        `;
    await queryRunner.query(query);
  }
}
