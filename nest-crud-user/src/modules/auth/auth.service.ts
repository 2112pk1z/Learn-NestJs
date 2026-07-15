import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/response/loginResponse.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`User logged in email=${user.email}, id=${user.id}`);
    return {
      accessToken: this.jwtService.sign(payload),
      name: user.name,
      email: user.email,
    };
  }
}
