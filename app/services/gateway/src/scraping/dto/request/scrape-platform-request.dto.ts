import { ApiProperty } from '@nestjs/swagger';

import { TransformInt } from '@/common/decorators';
import { SupportedPlatform } from '@/scraping/enums/supported-platform.enum';

export class ScrapePlatformRequestDto {
   @ApiProperty({
      type: String,
      enum: SupportedPlatform,
      enumName: 'SupportedPlatformEnum',
   })
   platform: SupportedPlatform;

   @ApiProperty({
      type: Number,
      required: false,
      description: 'Inclusive, starts with 1',
   })
   @TransformInt()
   startPage?: number;

   @ApiProperty({ type: Number, required: false, description: 'Inclusive' })
   @TransformInt()
   endPage?: number;
}
