import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Listing } from '@/listing/entities/listing.entity';

import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

@Module({
   imports: [TypeOrmModule.forFeature([Listing])],
   controllers: [ListingController],
   providers: [ListingService],
   exports: [],
})
export class ListingModule {}
