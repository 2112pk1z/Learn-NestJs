import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from './../modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'K8vN2qX7mLp4Rz9JcT5wHy1BaUf6DsEe',
    });
  }

  async validate(payload: any): Promise<User | null> {
    const email = payload.email;
    const user = await this.UserService.findByEmail(email);
    return user;
  }
}
