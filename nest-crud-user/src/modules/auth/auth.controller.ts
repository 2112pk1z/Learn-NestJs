import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { CreateUserDto } from '../user/dtos/createUserRequest.dto';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/loginRequest.dto';
import { LoginResponseDto } from './dto/response/loginResponse.dto';
import { ApiGetProfile, ApiLogin, ApiRegister } from './swagger/auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiRegister()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('/register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseData<User>> {
    const newUser = await this.userService.create(createUserDto);

    if (!newUser) {
      throw new ConflictException(
        new ResponseData<User>(null, HttpStatus.CONFLICT, HttpMessage.CONFLICT),
      );
    }

    return new ResponseData<User>(
      newUser,
      HttpStatus.CREATED,
      HttpMessage.CREATED,
    );
  }

  @ApiLogin()
  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() request: any,
    @Body() loginDTO: LoginRequestDto,
  ): Promise<ResponseData<LoginResponseDto>> {
    const user = request.user as User;
    const loginData = await this.authService.login(user);
    return new ResponseData<LoginResponseDto>(
      loginData,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  }

  @ApiGetProfile()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/profile')
  async getProfile(@Request() request: any): Promise<ResponseData<User>> {
    // const user = request.user as User;
    return new ResponseData<User>(request.user, HttpStatus.OK, HttpMessage.OK);
  }
}
