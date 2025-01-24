import { UserRole } from '@/features/auth/config/user-role';

export interface DecodedJwt {
   sub: string;
   email: string;
   role: UserRole;
   iat: number;
   exp: number;
   aud: string;
   iss: string;
}
