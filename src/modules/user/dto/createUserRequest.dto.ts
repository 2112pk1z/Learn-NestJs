import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Họ và tên đầy đủ của người dùng (tối thiểu 4 ký tự)',
    example: 'Nguyễn Đức Hùng',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  name: string;

  @ApiProperty({
    description: 'Địa chỉ email duy nhất để đăng nhập',
    example: 'hung.nguyen@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại định dạng Việt Nam',
    example: '0912345678',
  })
  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({
    description: 'Mật khẩu tài khoản (tối thiểu 8 ký tự, sẽ được mã hóa bằng bcrypt)',
    example: 'MậtKhẩu123@',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Ngày tháng năm sinh định dạng ISO (YYYY-MM-DD)',
    example: '2004-09-13',
  })
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;
}