import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { ListingService } from '@/listing/listing.service';

@Module({
   imports: [
      HttpModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService<AppEnv>) => ({
            baseURL: `${config.get('LISTING_SERVICE_URL')}/api/v1/listing/`,
            headers: {
               'X-API-KEY': config.get('LISTING_SERVICE_API_KEY'),
            },
         }),
      }),
   ],
   exports: [ListingService],
   providers: [ListingService],
   controllers: [],
})
export class ListingModule {}
