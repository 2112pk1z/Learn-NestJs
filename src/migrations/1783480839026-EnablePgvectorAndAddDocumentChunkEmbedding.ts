import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePgvectorAndAddDocumentChunkEmbedding1783480839026 implements MigrationInterface {
  name = 'EnablePgvectorAndAddDocumentChunkEmbedding1783480839026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    await queryRunner.query(
      `ALTER TABLE "document_chunks" ADD "embedding" vector(768)`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_document_chunks_embedding_hnsw" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_document_chunks_embedding_hnsw"`);

    await queryRunner.query(
      `ALTER TABLE "document_chunks" DROP COLUMN "embedding"`,
    );
  }
}
