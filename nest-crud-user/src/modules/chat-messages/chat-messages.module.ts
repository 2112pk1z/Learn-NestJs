import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from '../chat-session/entity/chatSession.entity';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessage } from './entity/chatMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, ChatSession])],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
})
export class ChatMessagesModule {}
