import {
  Body,
  Controller,
  Get,
  HttpStatus,
  MessageEvent,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from '../user/entity/user.entity';
import { ChatMessagesService } from './chat-messages.service';
import { SendChatMessageDto } from './dtos/sendChatMessage.dto';
import { ChatMessage } from './entity/chatMessage.entity';

@Controller('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get()
  async findBySession(
    @Query('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: any,
  ): Promise<ResponseData<ChatMessage[]>> {
    const currentUser = req.user as User;

    const messages = await this.chatMessagesService.findBySession(
      sessionId,
      currentUser,
    );

    return new ResponseData<ChatMessage[]>(
      messages,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @Post('user')
  async createUserMessage(
    @Body() sendChatMessageDto: SendChatMessageDto,
    @Req() req: any,
  ): Promise<ResponseData<ChatMessage>> {
    const currentUser = req.user as User;

    const message = await this.chatMessagesService.createUserMessage(
      sendChatMessageDto,
      currentUser,
    );

    return new ResponseData<ChatMessage>(
      message,
      HttpStatus.CREATED,
      HttpMessage.CREATED,
    );
  }

  @Sse('stream')
  streamAssistantMessage(
    @Query('sessionId', ParseIntPipe) sessionId: number,
    @Query('userMessageId', ParseIntPipe) userMessageId: number,
    @Req() req: any,
  ): Observable<MessageEvent> {
    const currentUser = req.user as User;

    return new Observable<MessageEvent>((subscriber) => {
      void (async () => {
        try {
          const userMessage =
            await this.chatMessagesService.findUserMessageById(
              userMessageId,
              sessionId,
              currentUser,
            );

          subscriber.next({
            type: 'start',
            data: {
              sessionId,
              userMessageId,
            },
          });

          const answer = this.chatMessagesService.generateMockAssistantAnswer(
            userMessage.content,
          );

          const chunks = this.chatMessagesService.splitAnswerToChunks(answer);

          let fullAnswer = '';

          for (const chunk of chunks) {
            fullAnswer += chunk;

            subscriber.next({
              type: 'chunk',
              data: {
                content: chunk,
              },
            });

            await new Promise((resolve) => setTimeout(resolve, 120));
          }

          const assistantMessage =
            await this.chatMessagesService.createAssistantMessage(
              sessionId,
              fullAnswer.trim(),
              currentUser,
            );

          subscriber.next({
            type: 'done',
            data: assistantMessage,
          });

          subscriber.complete();
        } catch (error) {
          subscriber.next({
            type: 'error',
            data: {
              message: 'Cannot stream assistant message',
            },
          });

          subscriber.complete();
        }
      })();
    });
  }
}
