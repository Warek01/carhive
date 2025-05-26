import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import qs from 'qs';
import { ConfigService } from '@nestjs/config';

import { ListingService } from './listing.service';
import { AppEnv } from '@/common/types/app-env';

@Module({
   providers: [ListingService],
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            paramsSerializer: (obj) => qs.stringify(obj),
            baseURL: `${config.get('LISTING_SERVICE_URL')}/api/v1/listing/`,
            headers: {
               'X-API-KEY': config.get('LISTING_SERVICE_API_KEY'),
            },
         }),
      }),
   ],
   exports: [ListingService],
   controllers: [],
})
export class ListingModule {}
