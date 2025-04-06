import {
   Body,
   Controller,
   Get,
   Param,
   ParseBoolPipe,
   ParseIntPipe,
   Post,
   Query,
} from '@nestjs/common';
import {
   ApiOkResponse,
   ApiOperation,
   ApiNotFoundResponse,
   ApiTags,
} from '@nestjs/swagger';

import { ListingService } from '@/listing/listing.service';
import { Public } from '@/auth/decorators/auth.decorator';
import { GetListingsRequestDto } from '@/listing/dto/request/get-listings-request.dto';
import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { Listing } from '@/listing/types/listing';
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';

@Public()
@ApiTags('Listing')
@Controller('listing')
export class ListingController {
   constructor(private readonly listingService: ListingService) {}

   @Get(':id')
   @ApiOperation({
      summary: 'Find a listing',
      description: 'Required role: <b>None</b>',
   })
   @ApiOkResponse()
   @ApiNotFoundResponse()
   findListing(
      @Param('id', ParseIntPipe) id: number,
      @Query('includeMetadata', ParseBoolPipe) includeMetadata: boolean = true,
   ): Promise<Listing> {
      return this.listingService.getOne(id, includeMetadata);
   }

   @Get()
   @ApiOperation({
      summary: 'Get multiple listings',
      description: 'Required role: <b>None</b>',
   })
   @ApiOkResponse({ type: PaginatedResponseDto<Listing> })
   getListings(
      @Query() dto: GetListingsRequestDto,
   ): Promise<PaginatedResponseDto<Listing>> {
      return this.listingService.get(dto);
   }

   @Post()
   @ApiOperation({
      summary: 'Create a listing',
      description: 'Required role: <b>User</b>',
   })
   createListing(@Body() dto: CreateListingDto): Promise<Listing> {
      return this.listingService.create(dto);
   }
}
