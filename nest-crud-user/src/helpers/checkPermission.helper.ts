import { User } from 'src/modules/user/entity/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';

export class PermissionChecker {
  static checkPermission(id: number, currentUser: User): boolean {
    if (currentUser.role === Role.ADMIN) {
      return true;
    }
    if (id === currentUser.id) {
      return true;
    }
    return false;
  }
}
