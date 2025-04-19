import { ApiProperty } from '@nestjs/swagger';

import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Platform,
   Transmission,
} from '@/listing/enums';
import { ListingAuthor } from '@/listing/types/listing-author.types';

export class CreateListingDto {
   @ApiProperty({
      type: [String],
      example: [
         'https://i.simpalsmedia.com/999.md/BoardImages/900x900/4e4d971f55bbac7e9fa94519866bd2b8.jpg',
      ],
   })
   images: string[];

   @ApiProperty({ type: String, example: 'Test litings' })
   title: string;

   @ApiProperty({ type: String, nullable: true, example: 'test car' })
   description?: string;

   @ApiProperty({ type: Number, nullable: true, example: 2020 })
   productionYear?: number;

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

   @ApiProperty({ type: Number, nullable: true })
   mileage?: number;

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
   currency?: Currency;

   @ApiProperty({ type: String, example: '67903000', nullable: true })
   metadataOriginalId?: string;

   @ApiProperty({
      type: String,
      example: 'https://999.md/ro/67903000',
      nullable: true,
   })
   metadataUrl?: string;

   @ApiProperty({ type: Date, example: new Date().toISOString() })
   metadataCreatedAt: Date;

   @ApiProperty({
      type: String,
      enum: Platform,
      enumName: 'PlatformEnum',
      example: Platform.TripleNineMd,
      nullable: true,
   })
   metadataPlatform?: Platform;

   @ApiProperty({
      example: {
         name: 'test',
         id: '1112222',
         email: 'test@gmail.com',
         url: 'https://example.com',
         phoneNumber: '+373123213',
      } as ListingAuthor,
   })
   metadataAuthor?: ListingAuthor;
}
