import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { ListingDto } from '@/listing/dto/response/listing.dto';

@Exclude()
export class GetListingsResponseDto extends PaginatedResponseDto<ListingDto> {
   @Expose()
   @ApiProperty({ type: [ListingDto] })
   @Type(() => ListingDto)
   items: ListingDto[] = [];
}
