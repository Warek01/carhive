import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { ENV_CONFIG } from '@/config/env.config';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { GLOBAL_VALIDATION_PIPE_CONFIG } from '@/config/global-validation-pipe.config';
import { ListingModule } from '@/listing/listing.module';
import { RecommendationModule } from '@/recommendation/recommendation.module';
import { ScrapingModule } from '@/scraping/scraping.module';

@Module({
   imports: [
      ConfigModule.forRoot(ENV_CONFIG),
      HealthModule,
      AuthModule,
      UserModule,
      ListingModule,
      RecommendationModule,
      ScrapingModule,
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
      {
         provide: APP_INTERCEPTOR,
         useClass: LoggingInterceptor,
      },
      {
         provide: APP_PIPE,
         useValue: new ValidationPipe(GLOBAL_VALIDATION_PIPE_CONFIG),
      },
   ],
   exports: [],
})
export class AppModule {}
