import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateListing } from '@/listing/types/listing.types';
import { listingEndpoints } from '@/listing/constants/listing-endpoints.constants';
import { firstValueFrom } from 'rxjs';
import { LISTING_QUEUE_TOKEN } from '@/listing/constants/injection-tokens.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ListingService {
   constructor(
      private readonly httpService: HttpService,
      @Inject(LISTING_QUEUE_TOKEN)
      private readonly scrapingQueueClient: ClientProxy,
   ) {}

   async createByQueue(dto: CreateListing): Promise<any> {
      this.scrapingQueueClient.emit('listing', dto);
   }

   async create(dto: CreateListing): Promise<any> {
      const res$ = this.httpService.post(listingEndpoints.create(), dto);
      const res = await firstValueFrom(res$);
      return res.data;
   }
}
