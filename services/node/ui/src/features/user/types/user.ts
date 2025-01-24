import { UserRole } from '@/features/auth/config/user-role';

export interface User {
   username: string;
   email: string;
   createdAt: string;
   id: number;
   deleted: boolean;
   deletedAt: Date | null;
   preferences: object | null;
   role: UserRole;
}
