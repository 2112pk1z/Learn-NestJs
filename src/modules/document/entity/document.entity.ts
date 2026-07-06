import { DocumentChunk } from 'src/modules/document-chunk/entity/documentChunk.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  filePath: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @OneToMany(() => DocumentChunk, (chunk) => chunk.document)
  chunks: DocumentChunk[];
}
