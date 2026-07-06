import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../global/globalEnum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Đọc danh sách roles yêu cầu từ Decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Nếu API không gắn @Roles(), cho phép qua
    if (!requiredRoles) {
      return true;
    }
    
    // Lấy thông tin user từ request (đã được JwtStrategy giải mã)
    const { user } = context.switchToHttp().getRequest();

    // Kiểm tra xem user có mang role phù hợp không
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này!');
    }
    
    return true;
  }
}