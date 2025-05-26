import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';

import { AppEnv } from '@/common/types/app-env';
import { AiService } from './ai.service';

@Module({
   providers: [AiService],
   exports: [AiService],
   controllers: [],
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
})
export class AiModule {}
