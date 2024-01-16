import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705324026171 implements MigrationInterface {
    name = 'Migration1705324026171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(64) NOT NULL,
                CONSTRAINT "uq_roles_name" UNIQUE ("name"),
                CONSTRAINT "pk_roles_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_roles_name" ON "roles" ("name")
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(64) NOT NULL,
                "password" character varying(72) NOT NULL,
                CONSTRAINT "uq_users_email" UNIQUE ("email"),
                CONSTRAINT "uq_users_password" UNIQUE ("password"),
                CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "pk_user_roles_role_id_user_id" PRIMARY KEY ("user_id", "role_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_user_roles_user_id" ON "user_roles" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_user_roles_role_id" ON "user_roles" ("role_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "fk_user_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "fk_user_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "fk_user_roles_role_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "fk_user_roles_user_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_user_roles_role_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_user_roles_user_id"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_users_email"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_roles_name"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
    }

}
