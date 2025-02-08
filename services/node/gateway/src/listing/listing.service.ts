import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { BaseMicroserviceService } from '@/common/classes/base-microservice-service';
import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { Listing } from '@/listing/types/listing';
import { listingEndpoints } from '@/listing/constants/listing-endpoints.constants';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';

@Injectable()
export class ListingService extends BaseMicroserviceService {
   constructor(httpService: HttpService) {
      super(httpService, new Logger(ListingService.name));
   }

   get(dto: GetListingsRequestDto): Promise<PaginatedResponseDto<Listing>> {
      return this.forwardRequest({
         url: listingEndpoints.get(),
         method: 'GET',
         params: dto,
      });
   }

   create(dto: CreateListingDto): Promise<Listing> {
      return this.forwardRequest({
         url: listingEndpoints.create(),
         method: 'POST',
         data: dto,
      });
   }

   getOne(id: number, includeMetadata: boolean = true): Promise<Listing> {
      return this.forwardRequest({
         url: listingEndpoints.getOne({ id: id.toString() }),
         params: { includeMetadata },
         method: 'GET',
      });
   }
}
