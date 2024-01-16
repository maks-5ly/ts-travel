import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705394253496 implements MigrationInterface {
  name = 'Migration1705394253496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tours" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "starting_date" date NOT NULL,
                "ending_date" date NOT NULL,
                "price" integer NOT NULL,
                "travel_id" uuid,
                CONSTRAINT "uq_tours_name" UNIQUE ("name"),
                CONSTRAINT "pk_tours_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "fk_tours_travel_id" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "fk_tours_travel_id"
        `);
    await queryRunner.query(`
            DROP TABLE "tours"
        `);
  }
}
