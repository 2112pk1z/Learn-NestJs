import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusUpdatedAtToChatSession1784707955148 implements MigrationInterface {
  name = 'AddStatusUpdatedAtToChatSession1784707955148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "filePath"`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "originalFileName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "objectKey" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "mimeType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "size" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "mimeType"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "objectKey"`);
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "originalFileName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "filePath" character varying NOT NULL`,
    );
  }
}
