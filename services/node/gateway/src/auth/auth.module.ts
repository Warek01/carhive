import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { AuthGuard } from '@/auth/guards/auth.guard';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            baseURL: `${config.get('ACCOUNT_SERVICE_URL')}/api/v1/auth/`,
         }),
      }),
   ],
   providers: [AuthService, AuthGuard],
   controllers: [AuthController],
   exports: [AuthGuard, AuthService],
})
export class AuthModule {}