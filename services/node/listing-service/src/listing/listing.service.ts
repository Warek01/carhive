import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Listing } from '@/listing/entities/listing.entity';
import { ListingStatus } from '@/listing/enums';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { ListingMetadata } from '@/listing/entities/listing-metadata.entity';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { LISTING_ORDER_BY_VALUES } from '@/listing/constants/listing-order-by-values.constants';

@Injectable()
export class ListingService {
   constructor(
      @InjectRepository(Listing)
      private readonly listingRepo: Repository<Listing>,
      @InjectRepository(ListingMetadata)
      private readonly metadataRepo: Repository<ListingMetadata>,
   ) {}

   getOne(id: number, includeMetadata = false): Promise<Listing | null> {
      return this.listingRepo.findOne({
         where: { id },
         relations: {
            metadata: includeMetadata,
         },
      });
   }

   get(dto: GetListingsRequestDto): Promise<[Listing[], number]> {
      let query = this.listingRepo.createQueryBuilder('listing');

      if (dto.priceMin) {
         query = query.andWhere('listing.price >= :priceMin', {
            priceMin: dto.priceMin,
         });
      }
      if (dto.priceMax) {
         query = query.andWhere('listing.price <= :priceMax', {
            priceMax: dto.priceMax,
         });
      }
      if (dto.brands) {
         query = query.andWhere('listing.brand IN (:...brands)', {
            brands: dto.brands,
         });
      }
      if (dto.models) {
         query = query.andWhere('listing.model IN (:...models)', {
            models: dto.models,
         });
      }
      if (dto.listingStatuses) {
         query = query.andWhere(
            'listing.listing_status IN (:...listingStatuses)',
            {
               listingStatuses: dto.listingStatuses,
            },
         );
      }
      if (dto.carStatuses) {
         query = query.andWhere('listing.car_status IN (:...carStatuses)', {
            carStatuses: dto.carStatuses,
         });
      }
      if (dto.createdAtMax) {
         query = query.andWhere('listing.created_at <= :createdAtMax', {
            createdAtMax: dto.createdAtMax,
         });
      }
      if (dto.createdAtMin) {
         query = query.andWhere('listing.created_at >= :createdAtMin', {
            createdAtMin: dto.createdAtMin,
         });
      }
      if (dto.colors) {
         query = query.andWhere('listing.color IN (:...colors)', {
            colors: dto.colors,
         });
      }
      if (dto.mileageMax) {
         query = query.andWhere('listing.mileage <= :mileageMax', {
            mileageMax: dto.mileageMax,
         });
      }
      if (dto.mileageMin) {
         query = query.andWhere('listing.mileage >= :mileageMin', {
            mileageMin: dto.mileageMin,
         });
      }
      if (dto.yearMax) {
         query = query.andWhere('listing.year <= :yearMax', {
            yearMax: dto.yearMax,
         });
      }
      if (dto.yearMin) {
         query = query.andWhere('listing.year >= :yearMin', {
            yearMin: dto.yearMin,
         });
      }
      if (dto.transmissions) {
         query = query.andWhere('listing.transmission IN (:...transmissions)', {
            transmissions: dto.transmissions,
         });
      }
      if (dto.drivetrains) {
         query = query.andWhere('listing.drivetrain IN (:...drivetrains)', {
            drivetrains: dto.drivetrains,
         });
      }
      if (dto.bodyStyles) {
         query = query.andWhere('listing.body_style IN (:...bodyStyles)', {
            bodyStyles: dto.bodyStyles,
         });
      }
      if (dto.fuelTypes) {
         query = query.andWhere('listing.fuel_types IN (:...fuelTypes)', {
            fuelTypes: dto.fuelTypes,
         });
      }
      if (dto.currencies) {
         query = query.andWhere('listing.currency IN (:...currencies)', {
            currencies: dto.currencies,
         });
      }
      if (dto.includeMetadata) {
         query = query.leftJoinAndSelect('listing.metadata', 'metadata');
      }
      if (dto.orderBy) {
         const [sort, order] = LISTING_ORDER_BY_VALUES[dto.orderBy];
         query = query.orderBy(`listing.${sort}`, order);
      }

      query = query.skip(dto.offset).take(dto.limit);

      return query.getManyAndCount();
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
      listing.currency = dto.currency;

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
