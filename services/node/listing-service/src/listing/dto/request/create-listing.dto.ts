import { ApiProperty } from '@nestjs/swagger';

import { CreateListingMetadataDto } from '@/listing/dto/request/create-listing-metadata.dto';
import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Transmission,
} from '@/listing/enums';

export class CreateListingDto {
   @ApiProperty({
      type: [String],
      example: [
         'https://i.simpalsmedia.com/999.md/BoardImages/900x900/4e4d971f55bbac7e9fa94519866bd2b8.jpg',
      ],
   })
   images: string[];

   @ApiProperty({ type: CreateListingMetadataDto })
   metadata: CreateListingMetadataDto;

   @ApiProperty({ type: String, nullable: true, example: 'test car' })
   description?: string;

   @ApiProperty({ type: String, nullable: true, example: 'Toyota' })
   brand?: string;

   @ApiProperty({ type: String, nullable: true, example: 'Camry' })
   model?: string;

   @ApiProperty({ type: Number, nullable: true, example: 1250000 })
   price?: number;

   @ApiProperty({ type: String, nullable: true, example: 'black' })
   color?: string;

   @ApiProperty({
      type: String,
      enum: CarStatus,
      enumName: 'CarStatusEnum',
      nullable: true,
      example: CarStatus.Used,
   })
   carStatus?: CarStatus;

   @ApiProperty({
      type: String,
      enum: BodyStyle,
      enumName: 'BodyStyleEnum',
      nullable: true,
      example: BodyStyle.Sedan,
   })
   bodyStyle?: BodyStyle;

   @ApiProperty({
      type: String,
      enum: Drivetrain,
      enumName: 'DrivetrainEnum',
      nullable: true,
      example: Drivetrain.AllWheelDrive,
   })
   drivetrain?: Drivetrain;

   @ApiProperty({
      type: String,
      enum: FuelType,
      enumName: 'FuelTypeEnum',
      nullable: true,
      example: FuelType.Petrol,
   })
   fuelType?: FuelType;

   @ApiProperty({
      type: String,
      enum: Transmission,
      enumName: 'TransmissionEnum',
      nullable: true,
      example: Transmission.Automatic,
   })
   transmission?: Transmission;

   @ApiProperty({
      type: String,
      enum: ListingStatus,
      enumName: 'ListingStatusEnum',
      nullable: true,
      example: ListingStatus.Available,
   })
   listingStatus?: ListingStatus;

   @ApiProperty({
      type: String,
      enum: Currency,
      enumName: 'CurrencyEnum',
      nullable: true,
      example: Currency.Usd,
   })
   currency: Currency;
}
