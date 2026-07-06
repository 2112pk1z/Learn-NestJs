import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1783327612908 implements MigrationInterface {
  name = 'InitTables1783327612908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."chat_message_role_enum" AS ENUM('assistant', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "citations" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."chat_message_role_enum" NOT NULL, "chatSessionId" integer, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_sessions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "dateOfBirth" date NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "filePath" character varying NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_chunks" ("id" SERIAL NOT NULL, "chunkContent" text NOT NULL, "metadata" jsonb, "documentId" integer, CONSTRAINT "PK_7f9060084e9b872dbb567193978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_94be4d12e248aacd9d8d1c09f70" FOREIGN KEY ("chatSessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_d0320df1059d8a029a460f4161d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_chunks" ADD CONSTRAINT "FK_eaf9afaf30fb7e2ac25989db51b" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document_chunks" DROP CONSTRAINT "FK_eaf9afaf30fb7e2ac25989db51b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_d0320df1059d8a029a460f4161d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_94be4d12e248aacd9d8d1c09f70"`,
    );
    await queryRunner.query(`DROP TABLE "document_chunks"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "chat_sessions"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TYPE "public"."chat_message_role_enum"`);
  }
}
