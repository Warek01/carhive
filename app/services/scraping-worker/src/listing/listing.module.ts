import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { ListingService } from '@/listing/listing.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LISTING_QUEUE_TOKEN } from '@/listing/constants/injection-tokens.constants';

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
      ClientsModule.registerAsync([
         {
            name: LISTING_QUEUE_TOKEN,
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppEnv>) => ({
               transport: Transport.RMQ,
               options: {
                  urls: [config.get<string>('MESSAGE_QUEUE_URL')!],
                  queue: 'listing',
                  queueOptions: {
                     durable: true,
                  },
               },
            }),
         },
      ]),
   ],
   exports: [ListingService],
   providers: [ListingService],
   controllers: [],
})
export class ListingModule {}
