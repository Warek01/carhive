import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { databaseConfig } from '@/config/database.config';
import { envConfig } from '@/config/env.config';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';

import { HealthModule } from './health/health.module';
import { ListingModule } from './listing/listing.module';

@Module({
   imports: [
      ConfigModule.forRoot(envConfig),
      TypeOrmModule.forRootAsync(databaseConfig),
      HealthModule,
      ListingModule,
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
