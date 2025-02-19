import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';

import { RecommendationService } from '@/recommendation/recommendation.service';
import { RecommendationController } from '@/recommendation/recommendation.controller';
import { AppEnv } from '@/common/types/app-env.types';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            paramsSerializer: (obj) => qs.stringify(obj),
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
