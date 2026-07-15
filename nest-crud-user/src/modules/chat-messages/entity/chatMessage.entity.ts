import { ChatSession } from 'src/modules/chat-session/entity/chatSession.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleChatMessage } from '../enums/roleChatMessage.enum';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  // (Example: [{"documentChunkId": 1, "score": 0.9}])
  @Column({ type: 'jsonb', nullable: true })
  citations: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: RoleChatMessage,
    enumName: 'chat_message_role_enum',
  })
  role: RoleChatMessage;

  @ManyToOne(() => ChatSession, (chatSession) => chatSession.ChatMessages, {
    onDelete: 'CASCADE',
  })
  chatSession: ChatSession;
}
