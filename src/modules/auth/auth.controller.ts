import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { CreateUserDto } from '../user/dto/createUserRequest.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseData<User>> {
    try {
      const newUser = await this.userService.create(createUserDto);
      return new ResponseData<User>(
        newUser,
        HttpStatus.CREATED,
        HttpMessage.CREATED,
      );
    } catch (error) {
      console.error('Lỗi khi tạo user:', error);
      return new ResponseData<User>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(@Body() loginDTO: LoginRequestDto): Promise<ResponseData<User>> {
    const user = await this.userService.validateUser(
      loginDTO.email,
      loginDTO.password,
    );
    if (!user) {
      return new ResponseData<User>(
        null,
        HttpStatus.UNAUTHORIZED,
        HttpMessage.UNAUTHORIZED,
      );
    }
    return new ResponseData<User>(user, HttpStatus.OK, HttpMessage.OK);
  }
}
