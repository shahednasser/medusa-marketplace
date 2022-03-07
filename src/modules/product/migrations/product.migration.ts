import { MigrationInterface, QueryRunner } from "typeorm";

import { Migration } from "medusa-extender";

@Migration()
export default class addStoreIdToProduct1645034402086
  implements MigrationInterface
{
  name = "addStoreIdToProduct1645034402086";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."product" ADD COLUMN IF NOT EXISTS "store_id" text;`;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."product" DROP COLUMN "store_id";`;
    await queryRunner.query(query);
  }
}
