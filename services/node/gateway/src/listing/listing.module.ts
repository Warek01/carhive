import { Module } from '@nestjs/common';

import { ListingService } from '@/listing/listing.service';
import { ListingController } from '@/listing/listing.controller';

@Module({
   providers: [ListingService],
   controllers: [ListingController],
})
export class ListingModule {}
