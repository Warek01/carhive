import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ListingDto {
   @Expose()
   @ApiProperty({ type: Number })
   id: number = null!;

   @Expose()
   @ApiProperty({ type: String, nullable: true })
   brand: string | null = null;

   @Expose()
   @ApiProperty({ type: String, nullable: true })
   model: string | null = null;

   @Expose()
   @ApiProperty({ type: Number, nullable: true })
   price: number | null = null;

   @Expose()
   @ApiProperty({ type: String, nullable: true })
   publishDate: string = null!;

   @Expose()
   @ApiProperty({ type: String, nullable: true })
   createdAt: string = null!;
}
