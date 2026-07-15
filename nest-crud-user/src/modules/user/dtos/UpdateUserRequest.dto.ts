import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New name of the user',
    example: 'Le Viet Hoang',
    minLength: 4,
  })
  @IsOptional()
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  name: string;

  @ApiPropertyOptional({
    description: 'New Vietnamese phone number of the user',
    example: '0912345678',
  })
  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'New password of the user',
    example: 'newPassword123',
    minLength: 8,
  })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiPropertyOptional({
    description: 'New date of birth of the user in ISO date format',
    example: '2004-12-21',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth: string;

  @ApiPropertyOptional({
    description: 'Active status of the user',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive: boolean;
}
