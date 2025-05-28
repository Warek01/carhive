import { ApiProperty } from '@nestjs/swagger';

import { EmbeddingDto } from './embedding.dto';

export class ListingEmbeddingDto extends EmbeddingDto {
   @ApiProperty()
   summary: string;

   @ApiProperty()
   rating: object;
}
