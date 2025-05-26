import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   ParseBoolPipe,
   ParseIntPipe,
   Post,
   Query,
   UploadedFiles,
   UseInterceptors,
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
import { CreateListingDto } from '@/listing/dto/request/create-listing.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetListingsResponseDto } from '@/listing/dto/response/get-listings-response.dto';
import { ListingDto } from '@/listing/dto/response/listing.dto';
import { Role } from '@/auth/decorators/roles.decroator';
import { UserRole } from '@/user/enums/user-role.enum';

@Public()
@ApiTags('Listing')
@Controller('listing')
export class ListingController {
   constructor(private readonly listingService: ListingService) {}

   @ApiOperation({ description: 'Get listings count' })
   @Get('count')
   @ApiOkResponse({ type: Number })
   async getCount(): Promise<number> {
      return this.listingService.getCount();
   }

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
   ): Promise<ListingDto> {
      return this.listingService.getOne(id, includeMetadata);
   }

   @Get()
   @ApiOperation({
      summary: 'Get multiple listings',
      description: 'Required role: <b>None</b>',
   })
   @ApiOkResponse({ type: GetListingsResponseDto })
   getListings(
      @Query() dto: GetListingsRequestDto,
   ): Promise<GetListingsResponseDto> {
      return this.listingService.get(dto);
   }

   @Delete(':id')
   @ApiOperation({})
   @ApiOkResponse({ type: ListingDto })
   @Role(UserRole.Admin)
   softDelete(@Param('id', ParseIntPipe) id: number) {
      return this.listingService.softDelete(id);
   }

   @Delete(':id/hard')
   @ApiOperation({})
   @ApiOkResponse({ type: ListingDto })
   @Role(UserRole.Admin)
   hardDelete(@Param('id', ParseIntPipe) id: number) {
      return this.listingService.hardDelete(id);
   }

   @Post()
   @ApiOperation({
      summary: 'Create a listing',
      description: 'Required role: <b>User</b>',
   })
   @ApiOkResponse({ type: ListingDto })
   @UseInterceptors(FilesInterceptor('images'))
   createListing(
      @Body() dto: CreateListingDto,
      @UploadedFiles() images: Express.Multer.File[] = [],
   ): Promise<ListingDto> {
      return this.listingService.create(dto, images);
   }
}
