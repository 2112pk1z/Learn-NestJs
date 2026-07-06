import { Controller } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';

@Controller('chat-session')
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}
}
