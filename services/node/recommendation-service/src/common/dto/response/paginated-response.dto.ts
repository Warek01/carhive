import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class PaginatedResponseDto<T> {
   abstract items: T[];

   @Expose()
   @ApiProperty({ type: Number })
   totalItems: number;

   @Expose()
   @ApiProperty({ type: Number })
   page: number;
}
