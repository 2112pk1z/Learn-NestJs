import { SetMetadata } from '@nestjs/common';
import { Role } from '../global/globalEnum';

export const ROLES_KEY = 'roles';
// Decorator này nhận vào một mảng các Role được phép truy cập
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);