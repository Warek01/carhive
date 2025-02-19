import { UserRole } from '@/enums/auth';

export interface DecodedJwt {
   sub: string;
   email: string;
   role: UserRole;
   iat: number;
   exp: number;
   aud: string;
   iss: string;
}

export interface LoginDto {
   email: string;
   password: string;
}

export interface RegisterDto {
   email: string;
   username: string;
   password: string;
}
