import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';
import { CreateUserDto } from '../user/dto/createUserRequest.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@ApiTags('Xác thực (Auth)')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description: 'Tạo một tài khoản người dùng mới. Mật khẩu sẽ được tự động băm (hash) trước khi lưu.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký thành công.', 
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi hệ thống khi tạo tài khoản.',
  })
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
  @ApiOperation({
    summary: 'Đăng nhập hệ thống - Đã test Hot Reload ahaha',
    description: 'Kiểm tra thông tin đăng nhập. Hiện tại đang trả về object User, sẽ nâng cấp trả về JWT Token trong Tuần 2.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Sai email hoặc mật khẩu.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({
    summary: 'Đăng nhập hệ thống',
    description: 'Xác thực người dùng và trả về JWT Token.',
  })
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req): Promise<ResponseData<any>> {
    // Nhờ LocalAuthGuard, req.user đã có sẵn thông tin nếu email/pass đúng
    const tokenData = await this.authService.login(req.user);
    
    return new ResponseData<any>(tokenData, HttpStatus.OK, HttpMessage.OK);
  }
}