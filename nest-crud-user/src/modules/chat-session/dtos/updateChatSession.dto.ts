import { IsString, MaxLength } from 'class-validator';

export class UpdateChatSessionDto {
  @IsString()
  @MaxLength(100)
  title: string;
}
