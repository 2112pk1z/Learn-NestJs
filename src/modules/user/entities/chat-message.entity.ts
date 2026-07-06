import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatSession } from './chat-session.entity';

export enum SenderRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SenderRole })
  role: SenderRole;

  @Column({ type: 'text' })
  content: string;

  // Cột lưu JSON trích dẫn nguồn luật theo yêu cầu của dự án
  @Column({ type: 'jsonb', nullable: true })
  citations: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Mối quan hệ: Nhiều Message thuộc về 1 Session
  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  session: ChatSession;
}