import { ApiProperty } from '@nestjs/swagger';

import { SupportedPlatform } from '@/scraper/enums/supported-platform.enum';
import { TransformInt } from '@/common/decorators';

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
