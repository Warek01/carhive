import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListingFilterDto {
   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(0)
   priceMin?: number;

   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(0)
   priceMax?: number;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   brand?: string;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   model?: string;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   listingStatus?: string;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   carStatus?: string;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   color?: string;

   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(1900)
   yearMin?: number;

   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Max(new Date().getFullYear())
   yearMax?: number;

   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(0)
   mileageMin?: number;

   @ApiProperty({ type: Number, required: false })
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(0)
   mileageMax?: number;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   transmission?: string;

   @ApiProperty({ type: String, required: false })
   @IsOptional()
   @IsString()
   drivetrain?: string;
}
