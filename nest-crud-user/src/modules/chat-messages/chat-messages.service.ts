import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../chat-session/entity/chatSession.entity';
import { User } from '../user/entity/user.entity';

import { SendChatMessageDto } from './dtos/sendChatMessage.dto';
import { ChatMessage } from './entity/chatMessage.entity';
import { RoleChatMessage } from './enums/roleChatMessage.enum';

const DEFAULT_SESSION_TITLE = 'Cuộc trò chuyện mới';
const MAX_SESSION_TITLE_LENGTH = 40;

@Injectable()
export class ChatMessagesService {
  private readonly logger = new Logger(ChatMessagesService.name);

  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,
  ) {}

  private async findActiveOwnedSession(
    sessionId: number,
    currentUser: User,
  ): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: {
        id: sessionId,
        user: {
          id: currentUser.id,
        },
        status: true,
      },
    });

    if (!session) {
      this.logger.warn(
        `Chat session not found or forbidden. sessionId=${sessionId}, userId=${currentUser.id}`,
      );

      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  private buildSessionTitleFromMessage(content: string): string {
    const trimmedContent = content.trim();

    if (trimmedContent.length <= MAX_SESSION_TITLE_LENGTH) {
      return trimmedContent;
    }

    return `${trimmedContent.slice(0, MAX_SESSION_TITLE_LENGTH)}...`;
  }

  async findBySession(
    sessionId: number,
    currentUser: User,
  ): Promise<ChatMessage[]> {
    await this.findActiveOwnedSession(sessionId, currentUser);

    return this.chatMessageRepository.find({
      where: {
        chatSession: {
          id: sessionId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async createUserMessage(
    sendChatMessageDto: SendChatMessageDto,
    currentUser: User,
  ): Promise<ChatMessage> {
    this.logger.log(
      `Creating user message. sessionId=${sendChatMessageDto.sessionId}, userId=${currentUser.id}`,
    );

    const session = await this.findActiveOwnedSession(
      sendChatMessageDto.sessionId,
      currentUser,
    );

    const userMessageCount = await this.chatMessageRepository.count({
      where: {
        chatSession: {
          id: session.id,
        },
        role: RoleChatMessage.USER,
      },
    });

    const isFirstUserMessage = userMessageCount === 0;

    const message = this.chatMessageRepository.create({
      content: sendChatMessageDto.content,
      role: RoleChatMessage.USER,
      chatSession: session,
    });

    const savedMessage = await this.chatMessageRepository.save(message);

    if (isFirstUserMessage && session.title === DEFAULT_SESSION_TITLE) {
      session.title = this.buildSessionTitleFromMessage(
        sendChatMessageDto.content,
      );
      await this.chatSessionRepository.save(session);
    }

    return savedMessage;
  }

  async createAssistantMessage(
    sessionId: number,
    content: string,
    currentUser: User,
  ): Promise<ChatMessage> {
    const session = await this.findActiveOwnedSession(sessionId, currentUser);

    const message = this.chatMessageRepository.create({
      content,
      role: RoleChatMessage.ASSISTANT,
      chatSession: session,
    });

    return this.chatMessageRepository.save(message);
  }

  generateMockAssistantAnswer(userContent: string): string {
    return `Hệ thống đã lưu trữ thành công tin nhắn: "${userContent}"`;
  }

  splitAnswerToChunks(answer: string): string[] {
    return answer.split(' ').map((word) => `${word} `);
  }

  async findUserMessageById(
    userMessageId: number,
    sessionId: number,
    currentUser: User,
  ): Promise<ChatMessage> {
    await this.findActiveOwnedSession(sessionId, currentUser);

    const message = await this.chatMessageRepository.findOne({
      where: {
        id: userMessageId,
        role: RoleChatMessage.USER,
        chatSession: {
          id: sessionId,
        },
      },
    });

    if (!message) {
      throw new NotFoundException('User message not found');
    }

    return message;
  }
}
