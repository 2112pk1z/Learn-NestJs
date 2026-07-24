import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../chat-messages/entity/chatMessage.entity';
import { RoleChatMessage } from '../chat-messages/enums/roleChatMessage.enum';
import { User } from '../user/entity/user.entity';
import { CreateChatSessionDto } from './dtos/createChatSession.dto';
import { UpdateChatSessionDto } from './dtos/updateChatSession.dto';
import { ChatSession } from './entity/chatSession.entity';

const DEFAULT_SESSION_TITLE = 'Cuộc trò chuyện mới';
const WELCOME_MESSAGE = 'Xin chào, tôi có thể giúp gì cho bạn?';

@Injectable()
export class ChatSessionService {
  private readonly logger = new Logger(ChatSessionService.name);

  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async findAll(currentUser: User): Promise<ChatSession[]> {
    return this.chatSessionRepository.find({
      where: {
        user: {
          id: currentUser.id,
        },
        status: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(
    createChatSessionDto: CreateChatSessionDto,
    currentUser: User,
  ): Promise<ChatSession> {
    this.logger.log(`Creating chat session for user id=${currentUser.id}`);

    const session = this.chatSessionRepository.create({
      title: createChatSessionDto.title || DEFAULT_SESSION_TITLE,
      user: currentUser,
      status: true,
    });

    const savedSession = await this.chatSessionRepository.save(session);

    const welcomeMessage = this.chatMessageRepository.create({
      content: WELCOME_MESSAGE,
      role: RoleChatMessage.ASSISTANT,
      chatSession: savedSession,
    });

    await this.chatMessageRepository.save(welcomeMessage);

    return savedSession;
  }

  private async findActiveSessionById(
    id: number,
    currentUser: User,
  ): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
        status: true,
      },
    });

    if (!session) {
      this.logger.warn(
        `Chat session not found or forbidden. sessionId=${id}, userId=${currentUser.id}`,
      );

      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  async updateTitle(
    id: number,
    updateChatSessionDto: UpdateChatSessionDto,
    currentUser: User,
  ): Promise<ChatSession> {
    this.logger.log(
      `Updating chat session title. sessionId=${id}, userId=${currentUser.id}`,
    );

    const session = await this.findActiveSessionById(id, currentUser);

    session.title = updateChatSessionDto.title;

    return this.chatSessionRepository.save(session);
  }

  async softDelete(id: number, currentUser: User): Promise<ChatSession> {
    this.logger.log(
      `Soft deleting chat session. sessionId=${id}, userId=${currentUser.id}`,
    );

    const session = await this.findActiveSessionById(id, currentUser);

    session.status = false;

    return this.chatSessionRepository.save(session);
  }
}
