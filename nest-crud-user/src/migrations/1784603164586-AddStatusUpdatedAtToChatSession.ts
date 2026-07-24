import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusUpdatedAtToChatSession1784603164586 implements MigrationInterface {
  name = 'AddStatusUpdatedAtToChatSession1784603164586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" ADD "status" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_sessions" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" DROP COLUMN "updatedAt"`,
    );
  }
}
