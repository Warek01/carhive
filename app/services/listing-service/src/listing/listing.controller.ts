import {
   Body,
   Controller,
   Delete,
   Get,
   Logger,
   NotFoundException,
   Param,
   ParseBoolPipe,
   ParseIntPipe,
   Post,
   Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
   Ctx,
   MessagePattern,
   Payload,
   RmqContext,
} from '@nestjs/microservices';

import { ListingDto } from '@/listing/dto/response/listing.dto';
import { ListingService } from '@/listing/listing.service';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { GetListingsResponseDto } from '@/listing/dto/response/get-listings-response.dto';
import { ack } from '@/common/functions/ack';
import { SimilaritySearchDto } from '@/listing/dto/request/similarity-search.dto';

@Controller('listing')
@ApiTags('Listing')
export class ListingController {
   private readonly logger = new Logger(ListingController.name);

   constructor(private readonly listingService: ListingService) {}

   @Get()
   async get(
      @Query() queryDto: GetListingsRequestDto,
   ): Promise<GetListingsResponseDto> {
      const [listings, count] = await this.listingService.get(queryDto);
      return plainToInstance(GetListingsResponseDto, {
         items: listings,
         totalItems: count,
         page: Math.floor(queryDto.offset / queryDto.limit),
      });
   }

   @Post('')
   async create(@Body() dto: CreateListingDto): Promise<ListingDto> {
      const listing = await this.listingService.create(dto);
      return plainToInstance(ListingDto, listing);
   }

   @Get('count')
   @ApiOkResponse({ type: Number })
   async getCount(): Promise<number> {
      return this.listingService.getCount();
   }

   @Get(':id')
   @ApiQuery({
      name: 'includeMetadata',
      type: Boolean,
      required: false,
      default: true,
   })
   async getOne(
      @Param('id', ParseIntPipe) id: number,
      @Query('includeMetadata', ParseBoolPipe) includeMetadata: boolean = false,
   ): Promise<ListingDto> {
      const listing = await this.listingService.getOne(id, includeMetadata);

      if (!listing) {
         throw new NotFoundException();
      }

      return plainToInstance(ListingDto, listing);
   }

   @Delete(':id')
   async softDelete(
      @Param('id', ParseIntPipe) id: number,
   ): Promise<ListingDto | null> {
      let listing = await this.listingService.getOne(id, false);
      if (!listing) {
         return null;
      }

      listing = await this.listingService.softDelete(listing);
      return plainToInstance(ListingDto, listing);
   }

   @Delete(':id/hard')
   async hardDelete(
      @Param('id', ParseIntPipe) id: number,
   ): Promise<ListingDto | null> {
      let listing = await this.listingService.getOne(id, false);
      if (!listing) {
         return null;
      }

      listing = await this.listingService.hardDelete(listing);
      return plainToInstance(ListingDto, listing);
   }

   @Post('similarity-search')
   async similaritySearch(
      @Body() dto: SimilaritySearchDto,
   ): Promise<GetListingsResponseDto> {
      const listings = await this.listingService.similaritySearch(dto);
      return plainToInstance(GetListingsResponseDto, {
         items: listings,
         page: 0,
         totalItems: listings.length,
      });
   }

   @MessagePattern('listing')
   async createFromQueue(
      @Payload() dto: CreateListingDto,
      @Ctx() ctx: RmqContext,
   ): Promise<void> {
      const listing = await this.listingService.create(dto);
      if (listing) {
         this.logger.log(`Created listing ${listing?.metadata?.listingId}`);
      }
      ack(ctx);
   }
}
