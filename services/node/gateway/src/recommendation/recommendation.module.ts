import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { RecommendationService } from '@/recommendation/recommendation.service';
import { RecommendationController } from '@/recommendation/recommendation.controller';
import { AppEnv } from '@/common/types/app-env';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            baseURL: `${config.get('RECOMMENDATION_SERVICE_URL')}/api/v1/ai/`,
            headers: {
               'X-API-KEY': config.get('RECOMMENDATION_SERVICE_API_KEY'),
            },
         }),
      }),
   ],
   controllers: [RecommendationController],
   providers: [RecommendationService],
   exports: [],
})
export class RecommendationModule {}
