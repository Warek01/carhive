import { ApiBase } from '@/api/api-base';
import { Pagination, PaginatedResponse } from '@/types/api';
import { CreateUserDto, UpdateUserDto, User } from '@/types/user';

export class UserApi extends ApiBase {
   private static singleton: UserApi = null!;

   protected readonly BASE_PATH = 'v1/user';

   static getSingleton(): UserApi {
      UserApi.singleton ??= new UserApi();
      return UserApi.singleton;
   }

   getOne(id: number): Promise<User> {
      return this._get(id.toString());
   }

   get(params: Pagination): Promise<PaginatedResponse<User>> {
      return this._get('', { params });
   }

   update(id: number, updateDto: UpdateUserDto): Promise<User> {
      return this._patch(id.toString(), updateDto);
   }

   delete(id: number): Promise<User> {
      return this._delete(id.toString());
   }

   create(createDto: CreateUserDto): Promise<User> {
      return this._post('', createDto);
   }
}
