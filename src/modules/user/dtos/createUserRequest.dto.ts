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
    description: 'Name of the user',
    example: 'Le Viet Hoang',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'hoang@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Vietnamese phone number of the user',
    example: '0912345678',
  })
  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '21122004',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Date of birth of the user in ISO date format',
    example: '2004-12-21',
    format: 'date',
  })
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;
}
