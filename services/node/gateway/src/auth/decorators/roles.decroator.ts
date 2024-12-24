import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@/user/enums/user-role.enum';

export const ROLE_METADATA_KEY = 'role';

export const RoleHierarchy = [
   UserRole.User,
   UserRole.Admin,
   UserRole.SuperAdmin,
];

// Role auth decorator
export const Role = (role: UserRole) => SetMetadata(ROLE_METADATA_KEY, role);
