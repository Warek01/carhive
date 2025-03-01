import { ApiProperty } from '@nestjs/swagger';

import { ListingAuthor } from '@/listing/types/listing-author.types';
import { Platform } from '@/listing/enums';

export class CreateListingMetadataDto {
   @ApiProperty({ type: String, example: '67903000' })
   originalId: string;

   @ApiProperty({ type: String, example: 'https://999.md/ro/67903000' })
   url: string;

   @ApiProperty({ type: Date, example: new Date().toISOString() })
   createdAt: Date;

   @ApiProperty({
      type: String,
      enum: Platform,
      enumName: 'PlatformEnum',
      example: Platform.TripleNineMd,
   })
   platform: Platform;

   @ApiProperty({
      example: {
         name: 'test',
         id: '1112222',
         email: 'test@gmail.com',
         url: 'http://example.com',
         phoneNumber: '+373123213',
      } as ListingAuthor,
   })
   author?: ListingAuthor;
}
