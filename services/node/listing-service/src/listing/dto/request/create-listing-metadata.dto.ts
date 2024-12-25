import { ApiProperty } from '@nestjs/swagger';

import { ListingAuthor } from '@/listing/types/listing-author.types';

export class CreateListingMetadataDto {
   @ApiProperty({ type: String, example: '67903000' })
   originalId: string;

   @ApiProperty({ type: String, example: 'https://999.md/ro/67903000' })
   fullUrl: string;

   @ApiProperty({ type: String, example: '/ro/67903000' })
   relativeUrl: string;

   @ApiProperty({ type: Date, example: new Date().toISOString() })
   createdAt: Date;

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
