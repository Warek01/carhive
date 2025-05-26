import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { ListingStatus } from '@/listing/enums/listing-status.enum';
import { CarStatus } from '@/listing/enums/car-status.enum';
import { BodyStyle } from '@/listing/enums/body-style.enum';
import { Drivetrain } from '@/listing/enums/drivetrain.enum';
import { FuelType } from '@/listing/enums/fuel-type.enum';
import { Transmission } from '@/listing/enums/transmission.enum';
import { Currency } from '@/listing/enums/currency.enum';
import { ListingMetadataDto } from '@/listing/dto/response/listing-metadata.dto';

@Exclude()
export class ListingDto {
   @ApiProperty({ type: Number })
   @Expose()
   id: number;

   @ApiProperty({ type: Date })
   @Expose()
   updatedAt: Date;

   @ApiProperty({ type: Date })
   @Expose()
   createdAt: Date;

   @ApiProperty({ type: Number, nullable: true })
   @Expose()
   mileage?: number;

   @ApiProperty({ type: [String] })
   @Expose()
   images: string[];

   @ApiProperty({ type: String })
   @Expose()
   title: string;

   @ApiProperty({ type: Number })
   @Expose()
   productionYear?: number;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   description?: string;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   brand?: string;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   model?: string;

   @ApiProperty({ type: Number, nullable: true })
   @Expose()
   price?: number;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: Currency,
      enumName: 'CurrencyEnum',
   })
   @Expose()
   currency?: Currency;

   @ApiProperty({ type: String, nullable: true })
   @Expose()
   color?: string;

   @ApiProperty({
      type: String,
      enum: ListingStatus,
      enumName: 'ListingStatusEnum',
   })
   @Expose()
   listingStatus: ListingStatus = ListingStatus.Draft;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: CarStatus,
      enumName: 'CarStatusEnum',
   })
   @Expose()
   carStatus?: CarStatus;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: BodyStyle,
      enumName: 'BodyStyleEnum',
   })
   @Expose()
   bodyStyle?: BodyStyle;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: Drivetrain,
      enumName: 'DrivetrainEnum',
   })
   @Expose()
   drivetrain?: Drivetrain;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: FuelType,
      enumName: 'FuelTypeEnum',
   })
   @Expose()
   fuelType?: FuelType;

   @ApiProperty({
      type: String,
      nullable: true,
      enum: Transmission,
      enumName: 'TransmissionEnum',
   })
   @Expose()
   transmission?: Transmission;

   @ApiProperty({
      type: ListingMetadataDto,
      nullable: true,
   })
   @Expose()
   @Type(() => ListingMetadataDto)
   metadata?: ListingMetadataDto;

   @ApiProperty({
      type: String,
      nullable: true,
   })
   @Expose()
   summary?: string;
}
