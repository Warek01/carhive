import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

import { ENV_CONFIG } from '@/config/env.config';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';
import { HealthModule } from '@/health/health.module';
import { AiModule } from '@/ai/ai.module';
import { AppEnv } from '@/common/types/app-env';
import { CacheModule as AppCacheModule } from './cache/cache.module';

@Module({
   imports: [
      ConfigModule.forRoot(ENV_CONFIG),
      CacheModule.registerAsync({
         isGlobal: true,
         inject: [ConfigService],
         useFactory: async (config: ConfigService<AppEnv>) => ({
            stores: [createKeyv({ url: config.get('CACHE_URL') })],
         }),
      }),
      HealthModule,
      AiModule,
      AppCacheModule,
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
export class AppModule {}
