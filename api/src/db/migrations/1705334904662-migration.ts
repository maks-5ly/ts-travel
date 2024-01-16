import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705334904662 implements MigrationInterface {
  name = 'Migration1705334904662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "travels" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" text,
                "number_of_days" integer NOT NULL,
                "is_public" boolean NOT NULL DEFAULT false,
                "moods" json NOT NULL,
                CONSTRAINT "pk_travels_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_travels_slug" ON "travels" ("slug")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_travels_name" ON "travels" ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_travels_name"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_travels_slug"
        `);
    await queryRunner.query(`
            DROP TABLE "travels"
        `);
  }
}
