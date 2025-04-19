import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { CarRecommendationDto } from '@/recommendation/dto/response/car-recommendation.dto';

export class AiResponseDto {
   @ApiProperty({ type: Object, isArray: true, nullable: true })
   @Type(() => CarRecommendationDto)
   cars?: CarRecommendationDto[];

   @ApiProperty({ type: String, nullable: true })
   error?: string;
}
