import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { envConfig } from '@/config/env.config';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Module({
   imports: [
      ConfigModule.forRoot(envConfig),
      HealthModule,
      AuthModule,
      UserModule,
   ],
   controllers: [],
   providers: [
      {
         provide: APP_GUARD,
         useClass: AuthGuard,
      },
      {
         provide: APP_GUARD,
         useClass: RolesGuard,
      },
   ],
   exports: [],
})
export class AppModule {}
