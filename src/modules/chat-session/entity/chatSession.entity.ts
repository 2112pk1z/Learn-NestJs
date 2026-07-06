import { ChatMessage } from 'src/modules/chat-messages/entity/chatMessage.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.chatSessions, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chatSession)
  ChatMessages: ChatMessage[];
}
