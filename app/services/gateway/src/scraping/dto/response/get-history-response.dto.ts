import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';
import { ListScrapeDto } from './list-scrape.dto';

@Exclude()
export class GetHistoryResponseDto extends PaginatedResponseDto<ListScrapeDto> {
   @Expose()
   @ApiProperty({ type: [ListScrapeDto] })
   @Type(() => ListScrapeDto)
   items: ListScrapeDto[] = [];
}
