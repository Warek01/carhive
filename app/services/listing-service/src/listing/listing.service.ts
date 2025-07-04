import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import pgvector from 'pgvector';

import { Listing } from '@/listing/entities/listing.entity';
import { ListingStatus } from '@/listing/enums';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { ListingMetadata } from '@/listing/entities/listing-metadata.entity';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { LISTING_ORDER_BY_VALUES } from '@/listing/constants/listing-order-by-values.constants';
import { AiService } from '@/ai/ai.service';
import { SimilaritySearchDto } from '@/listing/dto/request/similarity-search.dto';

@Injectable()
export class ListingService {
   private readonly logger = new Logger(ListingService.name);

   constructor(
      @InjectRepository(Listing)
      private readonly listingRepo: Repository<Listing>,
      @InjectRepository(ListingMetadata)
      private readonly metadataRepo: Repository<ListingMetadata>,
      private readonly aiService: AiService,
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
      const {
         currencies,
         listingStatuses,
         carStatuses,
         bodyStyles,
         brands,
         colors,
         createdAtMax,
         createdAtMin,
         mileageMax,
         mileageMin,
         yearMax,
         yearMin,
         priceMax,
         priceMin,
         includeMetadata,
         drivetrains,
         fuelTypes,
         models,
         orderBy,
         transmissions,
         offset,
         limit,
      } = dto;

      let query = this.listingRepo.createQueryBuilder('l');

      // Include only available listings
      query = query.andWhere('l.listing_status = :listingStatus', {
         listingStatus: ListingStatus.Available,
      });

      if (priceMin) {
         query = query.andWhere('l.price >= :priceMin', { priceMin });
      }
      if (priceMax) {
         query = query.andWhere('l.price <= :priceMax', { priceMax });
      }
      if (brands) {
         if (brands.includes('mercedes-benz')) {
            brands.push('mercedes');
         }

         query = query.andWhere('l.brand IN (:...brands)', { brands });
      }
      if (models) {
         const resultArray = models
            .filter((str) => /^[a-z] class$/.test(str))
            .map((str) => str.replace(' ', '-'));

         resultArray.forEach((str) => models.push(str));

         console.log(models);

         query = query.andWhere('l.model IN (:...models)', { models });
      }
      if (listingStatuses) {
         query = query.andWhere('l.listing_status IN (:...listingStatuses)', {
            listingStatuses,
         });
      }
      if (carStatuses) {
         query = query.andWhere('l.car_status IN (:...carStatuses)', {
            carStatuses,
         });
      }
      if (createdAtMax) {
         query = query.andWhere('l.created_at <= :createdAtMax', {
            createdAtMax,
         });
      }
      if (createdAtMin) {
         query = query.andWhere('l.created_at >= :createdAtMin', {
            createdAtMin,
         });
      }
      if (colors) {
         query = query.andWhere('l.color IN (:...colors)', { colors });
      }
      if (mileageMax) {
         query = query.andWhere('l.mileage <= :mileageMax', {
            mileageMax,
         });
      }
      if (mileageMin) {
         query = query.andWhere('l.mileage >= :mileageMin', {
            mileageMin,
         });
      }
      if (yearMax) {
         query = query.andWhere('l.production_year <= :yearMax', { yearMax });
      }
      if (yearMin) {
         query = query.andWhere('l.production_year >= :yearMin', { yearMin });
      }
      if (transmissions) {
         query = query.andWhere('l.transmission IN (:...transmissions)', {
            transmissions,
         });
      }
      if (drivetrains) {
         query = query.andWhere('l.drivetrain IN (:...drivetrains)', {
            drivetrains,
         });
      }
      if (bodyStyles) {
         query = query.andWhere('l.body_style IN (:...bodyStyles)', {
            bodyStyles,
         });
      }
      if (fuelTypes) {
         query = query.andWhere('l.fuel_type IN (:...fuelTypes)', {
            fuelTypes,
         });
      }
      if (currencies) {
         query = query.andWhere('l.currency IN (:...currencies)', {
            currencies,
         });
      }
      if (includeMetadata) {
         query = query.leftJoinAndSelect('l.metadata', 'm');
      }
      if (orderBy) {
         const [sort, order] = LISTING_ORDER_BY_VALUES[orderBy];
         query = query.orderBy(`l.${sort}`, order);
      }

      query = query.skip(offset).take(limit);

      return query.getManyAndCount();
   }

   async create(dto: CreateListingDto): Promise<Listing | null> {
      if (dto.metadataOriginalId !== undefined) {
         const metaExists = await this.metadataRepo.existsBy({
            originalId: dto.metadataOriginalId,
         });

         if (metaExists) {
            this.logger.log(
               `Skipping creation of fetched listing ${dto.metadataOriginalId}`,
            );

            return null;
         }
      }

      const listing = this.listingRepo.create({
         ...dto,
         listingStatus: dto.listingStatus ?? ListingStatus.Available,
         images: dto.images ?? [],
      });

      const { embedding, summary, rating } = await this.aiService.getEmbedding(listing);
      listing.embedding = pgvector.toSql(embedding);
      listing.summary = summary;
      listing.ratings = rating;

      const metadata = this.metadataRepo.create({
         originalId: dto.metadataOriginalId,
         createdAt: dto.metadataCreatedAt,
         url: dto.metadataUrl,
         author: dto.metadataAuthor,
         platform: dto.metadataPlatform,
         listing: listing,
         listingId: listing.id,
      });

      await this.metadataRepo.save(metadata);

      return listing;
   }

   getCount(): Promise<number> {
      return this.listingRepo.count();
   }

   softDelete(listing: Listing): Promise<Listing> {
      listing.listingStatus = ListingStatus.Deleted;
      return this.listingRepo.save(listing);
   }

   hardDelete(listing: Listing): Promise<Listing> {
      return this.listingRepo.remove(listing);
   }

   similaritySearch(dto: SimilaritySearchDto): Promise<Listing[]> {
      return this.listingRepo
         .createQueryBuilder('l')
         .orderBy('cast(embedding as vector) <-> :embedding')
         .setParameters({ embedding: pgvector.toSql(dto.embedding) })
         .limit(10)
         .skip(0)
         .getMany();
   }
}
