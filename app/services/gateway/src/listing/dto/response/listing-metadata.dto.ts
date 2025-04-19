import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ListingAuthor } from '@/listing/types/listing';
import { Platform } from '@/listing/enums';

@Exclude()
export class ListingMetadataDto {
   @ApiProperty({ type: Number })
   @Expose()
   listingId: number;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   originalId?: string;

   @ApiProperty({ type: String })
   @Expose()
   url: string;

   @ApiProperty({ type: String, enum: Platform, enumName: 'Platform' })
   @Expose()
   platform: Platform;

   @ApiProperty({ type: Date })
   @Expose()
   createdAt: Date;

   @ApiProperty({ type: Object, nullable: true })
   @Expose()
   author?: ListingAuthor;
}
