import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { SupportedPlatform } from '@/scraping/enums/supported-platform.enum';

@Exclude()
export class ListScrapeDto {
   @ApiProperty({ type: Number })
   @Expose()
   id: number;

   @ApiProperty({
      type: String,
      enum: SupportedPlatform,
      enumName: 'SupportedPlatform',
   })
   @Expose()
   platform: SupportedPlatform;

   @ApiProperty({
      nullable: true,
      type: Number,
   })
   @Expose()
   startPage?: number;

   @ApiProperty({
      nullable: true,
      type: Number,
   })
   @Expose()
   endPage?: number;

   @ApiProperty({ type: Boolean })
   @Expose()
   success: boolean;

   @ApiProperty({ type: Object, nullable: true })
   @Expose()
   error?: object;

   @ApiProperty({ type: Date })
   @Expose()
   createdAt: Date;
}
