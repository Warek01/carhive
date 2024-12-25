import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { ListingDto } from '@/listing/dto/response/listing.dto';

export class ListingGetDto extends PaginatedResponseDto<ListingDto> {
   @ApiProperty({ type: ListingDto })
   items: ListingDto[] = [];
}
