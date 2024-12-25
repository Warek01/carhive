import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { AuthModule } from '@/auth/auth.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            baseURL: `${config.get('ACCOUNT_SERVICE_URL')}/api/v1/user/`,
            headers: {
               'X-API-KEY': config.get('ACCOUNT_SERVICE_API_KEY'),
            },
         }),
      }),
      AuthModule,
   ],
   providers: [UserService],
   controllers: [UserController],
   exports: [],
})
export class UserModule {}
