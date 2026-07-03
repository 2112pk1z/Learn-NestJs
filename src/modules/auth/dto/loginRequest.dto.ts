import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Địa chỉ email đã đăng ký',
    example: 'hung.nguyen@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu tài khoản',
    example: 'MậtKhẩu123@',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}