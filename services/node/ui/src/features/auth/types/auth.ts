import { User } from '@/features/user/types/user';

export interface AuthResponse {
   user: User;
   token: string;
}
