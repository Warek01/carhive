import { ApiBase } from '@/api/api-base';
import { LoginDto } from '@/features/auth/types/login';
import { RegisterDto } from '@/features/auth/types/register';
import { User } from '@/features/user/types/user';

export class AuthApi extends ApiBase {
   private static singleton: AuthApi = null!;

   protected readonly BASE_PATH = 'v1/auth';

   static getSingleton(): AuthApi {
      AuthApi.singleton ??= new AuthApi();
      return AuthApi.singleton;
   }

   login(data: LoginDto): Promise<User> {
      return this.post('login', data);
   }

   register(data: RegisterDto): Promise<User> {
      return this.post('register', data);
   }

   logout(): Promise<void> {
      return this.post('unauthorize', null);
   }
}
