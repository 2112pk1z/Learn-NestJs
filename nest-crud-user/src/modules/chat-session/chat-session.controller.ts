import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from '../user/entity/user.entity';
import { ChatSessionService } from './chat-session.service';
import { CreateChatSessionDto } from './dtos/createChatSession.dto';
import { UpdateChatSessionDto } from './dtos/updateChatSession.dto';
import { ChatSession } from './entity/chatSession.entity';

@Controller('sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Get()
  async findAll(@Req() req: any): Promise<ResponseData<ChatSession[]>> {
    const currentUser = req.user as User;

    const sessions = await this.chatSessionService.findAll(currentUser);

    return new ResponseData<ChatSession[]>(
      sessions,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @Post()
  async create(
    @Body() createChatSessionDto: CreateChatSessionDto,
    @Req() req: any,
  ): Promise<ResponseData<ChatSession>> {
    const currentUser = req.user as User;

    const session = await this.chatSessionService.create(
      createChatSessionDto,
      currentUser,
    );

    return new ResponseData<ChatSession>(
      session,
      HttpStatus.CREATED,
      HttpMessage.CREATED,
    );
  }

  @Put(':id')
  async updateTitle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatSessionDto: UpdateChatSessionDto,
    @Req() req: any,
  ): Promise<ResponseData<ChatSession>> {
    const currentUser = req.user as User;

    const session = await this.chatSessionService.updateTitle(
      id,
      updateChatSessionDto,
      currentUser,
    );

    return new ResponseData<ChatSession>(
      session,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<ResponseData<ChatSession>> {
    const currentUser = req.user as User;

    const session = await this.chatSessionService.softDelete(id, currentUser);

    return new ResponseData<ChatSession>(
      session,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }
}
