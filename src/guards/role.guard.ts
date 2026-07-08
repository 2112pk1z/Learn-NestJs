import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);
  constructor(private roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const hasPermission = this.roles.includes(request.user.role.toLowerCase());

    if (!hasPermission) {
      this.logger.warn(
        `Forbidden action. Required roles=${this.roles.join(',')} currentRole=${request.user.role}`,
      );
      throw new ForbiddenException(
        new ResponseData<null>(
          null,
          HttpStatus.FORBIDDEN,
          HttpMessage.FORBIDDEN,
        ),
      );
    }

    return true;
  }
}
