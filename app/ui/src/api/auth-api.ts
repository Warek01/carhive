import { ApiBase } from '@/api/api-base';
import { LoginDto, RegisterDto } from '@/types/auth';
import { User } from '@/types/user';

export class AuthApi extends ApiBase {
   private static singleton: AuthApi = null!;

   protected readonly BASE_PATH = 'v1/auth';

   static getSingleton(): AuthApi {
      AuthApi.singleton ??= new AuthApi();
      return AuthApi.singleton;
   }

   getSelf(): Promise<User> {
      return this._get('');
   }

   login(data: LoginDto): Promise<User> {
      return this._post('login', data);
   }

   register(data: RegisterDto): Promise<User> {
      return this._post('register', data);
   }

   logout(): Promise<void> {
      return this._post('unauthorize', null);
   }
}
