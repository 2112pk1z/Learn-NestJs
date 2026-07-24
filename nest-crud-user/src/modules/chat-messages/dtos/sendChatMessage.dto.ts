import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class SendChatMessageDto {
  @Type(() => Number)
  @IsInt()
  sessionId: number;

  @IsString()
  content: string;
}
