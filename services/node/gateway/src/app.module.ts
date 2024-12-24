import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { envConfig } from '@/config/env.config';

@Module({
   imports: [
      ConfigModule.forRoot(envConfig),
      HealthModule,
      AuthModule,
      UserModule,
   ],
   controllers: [],
   providers: [],
   exports: [],
})
export class AppModule {}
