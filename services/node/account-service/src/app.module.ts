import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { databaseConfig } from '@/config/database.config';
import { envConfig } from '@/config/env.config';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';

import { HealthModule } from './health/health.module';

@Module({
   imports: [
      ConfigModule.forRoot(envConfig),
      TypeOrmModule.forRootAsync(databaseConfig),
      AuthModule,
      UserModule,
      HealthModule,
   ],
   controllers: [],
   providers: [
      {
         provide: APP_GUARD,
         useClass: ApiKeyGuard,
      },
      {
         provide: APP_INTERCEPTOR,
         useClass: LoggingInterceptor,
      },
   ],
   exports: [],
})
export class AppModule {}
