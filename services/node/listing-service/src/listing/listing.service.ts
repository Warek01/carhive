import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Listing } from '@/listing/entities/listing.entity';
import { PaginatedRequestDto } from '@/common/dto/request/paginated-request.dto';
import { ListingStatus } from '@/listing/enums/listing-status.enum';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { ListingMetadata } from '@/listing/entities/listing-metadata.entity';

@Injectable()
export class ListingService {
   constructor(
      @InjectRepository(Listing)
      private readonly listingRepo: Repository<Listing>,
      @InjectRepository(ListingMetadata)
      private readonly metadataRepo: Repository<ListingMetadata>,
   ) {}

   getOne(id: number): Promise<Listing | null> {
      return this.listingRepo.findOneBy({ id });
   }

   get(queryDto: PaginatedRequestDto): Promise<[Listing[], number]> {
      return this.listingRepo.findAndCount({
         take: queryDto.limit,
         skip: queryDto.offset,
      });
   }

   delete(listing: Listing): Promise<Listing> {
      listing.listingStatus = ListingStatus.Deleted;
      return this.listingRepo.save(listing);
   }

   async create(dto: CreateListingDto): Promise<Listing> {
      const listing = new Listing();
      listing.listingStatus = dto.listingStatus ?? ListingStatus.Available;
      listing.images = dto.images ?? [];
      listing.price = dto.price;
      listing.description = dto.description;
      listing.model = dto.model;
      listing.brand = dto.brand;
      listing.bodyStyle = dto.bodyStyle;
      listing.transmission = dto.transmission;
      listing.fuelType = dto.fuelType;
      listing.drivetrain = dto.drivetrain;
      listing.color = dto.color;
      listing.carStatus = dto.carStatus;

      await this.listingRepo.save(listing);

      const metadata = new ListingMetadata();
      listing.metadata = metadata;
      metadata.listing = listing;
      metadata.listingId = listing.id;
      metadata.author = dto.metadata.author;
      metadata.fullUrl = dto.metadata.fullUrl;
      metadata.relativeUrl = dto.metadata.relativeUrl;
      metadata.originalId = dto.metadata.originalId;
      metadata.createdAt = dto.metadata.createdAt;

      await this.metadataRepo.save(metadata);

      return listing;
   }
}
