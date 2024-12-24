import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { AppEnv } from '@/common/types/app-env';

@Module({
   providers: [AuthService],
   controllers: [AuthController],
   imports: [
      JwtModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            secret: config.get('JWT_SECRET'),
            signOptions: {
               issuer: 'carhive',
               audience: 'carhive',
               expiresIn: config.get('JWT_EXPIRES_IN'),
            },
         }),
      }),
      UserModule,
   ],
   exports: [],
})
export class AuthModule {}
