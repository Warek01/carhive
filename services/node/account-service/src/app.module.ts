import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { databaseConfig } from '@/config/database.config';
import { envConfig } from '@/config/env.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';

@Module({
   imports: [
      ConfigModule.forRoot(envConfig),
      TypeOrmModule.forRootAsync(databaseConfig),
      AuthModule,
      UserModule,
   ],
   controllers: [],
   providers: [
      {
         provide: APP_INTERCEPTOR,
         useClass: LoggingInterceptor,
      },
   ],
   exports: [],
})
export class AppModule {}
