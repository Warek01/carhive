import { UserRole } from '@/enums/auth';

export interface User {
   username: string;
   email: string;
   createdAt: string;
   id: number;
   deleted: boolean;
   deletedAt: Date | null;
   preferences: string | null;
   role: UserRole;
}

export interface UpdateUserDto {
   username?: string;
   email?: string;
   preferences?: string;
   role?: UserRole;
}

export interface CreateUserDto {
   email: string;
   username: string;
   password: string;
   role: UserRole;
}
