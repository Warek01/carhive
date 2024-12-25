import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Listing } from '@/listing/entities/listing.entity';
import { ListingController } from '@/listing/listing.controller';
import { ListingService } from '@/listing/listing.service';
import { ListingMetadata } from '@/listing/entities/listing-metadata.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Listing, ListingMetadata])],
   controllers: [ListingController],
   providers: [ListingService],
   exports: [],
})
export class ListingModule {}
