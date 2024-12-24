import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AppEnv } from '@/common/types/app-env';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/auth/auth.module';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            baseURL: `${config.get('ACCOUNT_SERVICE_URL')}/api/v1/user/`,
         }),
      }),
      AuthModule,
   ],
   providers: [UserService],
   controllers: [UserController],
   exports: [],
})
export class UserModule {}
