import {
   Body,
   Controller,
   Delete,
   Get,
   NotFoundException,
   Param,
   ParseIntPipe,
   Post,
   Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ListingDto } from '@/listing/dto/response/listing.dto';
import { PaginatedRequestDto } from '@/common/dto/request/paginated-request.dto';
import { ListingGetDto } from '@/listing/dto/response/listing-get.dto';
import { ListingService } from '@/listing/listing.service';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';

@Controller('listing')
@ApiTags('Listing')
export class ListingController {
   constructor(private readonly listingService: ListingService) {}

   @Get('')
   async get(@Query() queryDto: PaginatedRequestDto): Promise<ListingGetDto> {
      const [listings, count] = await this.listingService.get(queryDto);
      return plainToInstance(ListingGetDto, {
         items: listings,
         totalItems: count,
         page: Math.floor(count / queryDto.limit),
         itemsPerPage: queryDto.limit,
      });
   }

   @Post('')
   async create(@Body() dto: CreateListingDto): Promise<ListingDto> {
      const listing = await this.listingService.create(dto);
      return plainToInstance(ListingDto, listing);
   }

   @Get(':id')
   async getOne(@Param('id', ParseIntPipe) id: number): Promise<ListingDto> {
      const listing = await this.listingService.getOne(id);

      if (!listing) {
         throw new NotFoundException();
      }

      return plainToInstance(ListingDto, listing);
   }

   @Delete(':id')
   async delete(@Param('id') id: number): Promise<ListingDto> {
      const listing = await this.listingService.getOne(id);

      if (!listing) {
         throw new NotFoundException();
      }

      await this.listingService.delete(listing);
      return plainToInstance(ListingDto, listing);
   }
}
