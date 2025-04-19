import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as uuid from 'uuid';
import path from 'path';

import { BaseMicroserviceService } from '@/common/classes/base-microservice-service';
import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { Listing } from '@/listing/types/listing';
import { listingEndpoints } from '@/listing/constants/listing-endpoints.constants';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { MediaService } from '@/media/media.service';

@Injectable()
export class ListingService extends BaseMicroserviceService {
   constructor(
      httpService: HttpService,
      private readonly mediaService: MediaService,
   ) {
      super(httpService, new Logger(ListingService.name));
   }

   get(dto: GetListingsRequestDto): Promise<PaginatedResponseDto<Listing>> {
      return this.forwardRequest({
         url: listingEndpoints.get(),
         method: 'GET',
         params: dto,
      });
   }

   async create(
      dto: CreateListingDto,
      images: Express.Multer.File[],
   ): Promise<Listing> {
      const files = images.map((f) => ({
         name: `${uuid.v4()}${path.extname(f.originalname)}`,
         multerFile: f,
      }));
      await this.mediaService.createFiles(files);

      const newDto: CreateListingDto = {
         ...dto,
         images: files.map((f) => `/media/${f.name}`),
      };

      return this.forwardRequest({
         url: listingEndpoints.create(),
         method: 'POST',
         data: newDto,
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
