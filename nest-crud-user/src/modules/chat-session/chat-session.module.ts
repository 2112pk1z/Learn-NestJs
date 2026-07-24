import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from '../chat-messages/entity/chatMessage.entity';
import { ChatSessionController } from './chat-session.controller';
import { ChatSessionService } from './chat-session.service';
import { ChatSession } from './entity/chatSession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage])],
  controllers: [ChatSessionController],
  providers: [ChatSessionService],
})
export class ChatSessionModule {}
