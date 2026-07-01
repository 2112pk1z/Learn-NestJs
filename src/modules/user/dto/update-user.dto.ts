import {
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  name: string;

  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phone: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth: string;

  isActive: boolean;
}
