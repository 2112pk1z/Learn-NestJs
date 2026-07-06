import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Mối quan hệ: Nhiều Session thuộc về 1 User
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  // Mối quan hệ: 1 Session có N Messages
  @OneToMany(() => ChatMessage, (message) => message.session)
  messages: ChatMessage[];
}