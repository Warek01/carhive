import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateListing } from '@/listing/types/listing.types';
import { listingEndpoints } from '@/listing/constants/listing-endpoints.constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ListingService {
   constructor(private readonly httpService: HttpService) {}

   async create(dto: CreateListing): Promise<any> {
      const res$ = this.httpService.post(listingEndpoints.create(), dto);
      const res = await firstValueFrom(res$);
      return res.data;
   }
}
