import {
   Body,
   Controller,
   Get,
   NotFoundException,
   Param,
   ParseBoolPipe,
   ParseIntPipe,
   Post,
   Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ListingDto } from '@/listing/dto/response/listing.dto';
import { ListingService } from '@/listing/listing.service';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { GetListingsResponseDto } from '@/listing/dto/response/get-listings-response.dto';

@Controller('listing')
@ApiTags('Listing')
export class ListingController {
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
}
