import { Document } from 'src/modules/document/entity/document.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('document_chunks')
export class DocumentChunk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  chunkContent: string;

  // Metadata lưu trữ số trang, tiêu đề đoạn...
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  //   // Số 768 hoặc 1536 tùy thuộc vào model AI (VD: text-embedding của Gemini/OpenAI)
  //   @Column({ type: 'vector', length: 768, nullable: true })
  //   embedding: string;

  @ManyToOne(() => Document, (document) => document.chunks, {
    onDelete: 'CASCADE',
  })
  document: Document;
}
