import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ListingAuthor } from '@/listing/types/listing-author.types';

@Exclude()
export class ListingMetadataDto {
   @ApiProperty({ type: Number })
   @Expose()
   listingId: number;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   originalId?: string;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   url?: string;

   @ApiProperty({ type: Date })
   @Expose()
   createdAt: Date;

   @ApiProperty({ type: Object, nullable: true })
   @Expose()
   author?: ListingAuthor;
}
