import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Listing } from '@/listing/entities/listing.entity';

@Injectable()
export class ListingService {
   constructor(
      @InjectRepository(Listing)
      private readonly listingRepo: Repository<Listing>,
   ) {}
}
