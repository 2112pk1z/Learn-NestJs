import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'hoang@gmail.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '21122004',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
