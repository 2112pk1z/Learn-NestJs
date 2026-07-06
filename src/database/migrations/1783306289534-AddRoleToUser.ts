import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUser1783306289534 implements MigrationInterface {
    name = 'AddRoleToUser1783306289534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "role" "public"."Users_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum"`);
    }

}
