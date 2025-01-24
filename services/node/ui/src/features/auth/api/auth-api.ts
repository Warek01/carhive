import { AuthResponse } from '@/features/auth/types/auth';
import { ApiBase } from '@/api/api-base';
import { LoginDto } from '@/features/auth/types/login';
import { RegisterDto } from '@/features/auth/types/register';

export class AuthApi extends ApiBase {
   protected readonly BASE_PATH = 'v1/auth';

   async login(data: LoginDto): Promise<AuthResponse> {
      return this.post('login', data);
   }

   async register(data: RegisterDto): Promise<AuthResponse> {
      return this.post('register', data);
   }
}
