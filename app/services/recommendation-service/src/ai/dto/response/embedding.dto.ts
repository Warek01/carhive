import { ApiProperty } from '@nestjs/swagger';

export class EmbeddingDto {
   @ApiProperty()
   embedding: number[];
}
