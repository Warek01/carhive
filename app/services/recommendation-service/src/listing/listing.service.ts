import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { BaseMicroserviceService } from '@/common/classes/classes/base-microservice-service';
import { PaginatedResponse } from '@/common/types/api';
import { Listing } from '@/listing/listing.types';

@Injectable()
export class ListingService extends BaseMicroserviceService {
   constructor(httpService: HttpService) {
      super(httpService, new Logger(ListingService.name));
   }

   similaritySearch(embedding: number[]): Promise<PaginatedResponse<Listing>> {
      return this.forwardRequest({
         url: 'similarity-search',
         method: 'POST',
         data: {
            embedding,
         },
      });
   }
}
