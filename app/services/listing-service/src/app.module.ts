import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DataSource } from 'typeorm';
import pgvector from 'pgvector';

import { DB_CONFIG } from '@/config/database.config';
import { ENV_CONFIG } from '@/config/env.config';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';
import { HealthModule } from '@/health/health.module';
import { ListingModule } from '@/listing/listing.module';
import { AiModule } from './ai/ai.module';

@Module({
   imports: [
      ConfigModule.forRoot(ENV_CONFIG),
      TypeOrmModule.forRootAsync(DB_CONFIG),
      HealthModule,
      ListingModule,
      AiModule,
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
      {
         provide: APP_PIPE,
         useValue: new ValidationPipe({ transform: true }),
      },
   ],
   exports: [],
})
export class AppModule implements OnModuleInit {
   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

   async onModuleInit() {
      // await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
   }
}
