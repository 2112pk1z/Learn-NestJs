import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsDateString({}, { message: 'Date of birth must be a valid ISO date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;
}
