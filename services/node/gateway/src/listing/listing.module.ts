import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ListingService } from '@/listing/listing.service';
import { ListingController } from '@/listing/listing.controller';
import { AppEnv } from '@/common/types/app-env';

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
   providers: [ListingService],
   controllers: [ListingController],
   exports: [],
})
export class ListingModule {}
