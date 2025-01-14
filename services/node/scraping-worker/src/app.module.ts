import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ENV_CONFIG } from '@/config/env.config';
import { ScraperModule } from '@/scraper/scraper.module';
import { HealthModule } from '@/health/health.module';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';

@Module({
   imports: [ConfigModule.forRoot(ENV_CONFIG), ScraperModule, HealthModule],
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
