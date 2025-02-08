import { ApiProperty } from '@nestjs/swagger';

export class CarRecommendationDto {
   @ApiProperty({ type: String })
   brand: string;

   @ApiProperty({ type: String })
   model: string;
}
