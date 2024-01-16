import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705403244186 implements MigrationInterface {
  name = 'Migration1705403244186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "fk_tours_travel_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "fk_tours_travel_id" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "fk_tours_travel_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "fk_tours_travel_id" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
