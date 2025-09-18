import { SetMetadata } from '@nestjs/common';

// string key to store roles metadata
export const ROLES_KEY = 'roles';
// assign metadata roles to routes so that RolesGuard can check
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
