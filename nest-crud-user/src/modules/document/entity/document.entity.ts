import { DocumentChunk } from 'src/modules/document-chunk/entity/documentChunk.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  originalFileName: string;

  @Column()
  objectKey: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DocumentChunk, (chunk) => chunk.document)
  chunks: DocumentChunk[];
}
