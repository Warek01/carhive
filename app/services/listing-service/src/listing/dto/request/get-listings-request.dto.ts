import { ApiProperty } from '@nestjs/swagger';

import { PaginatedRequestDto } from '@/common/dto/request/paginated-request.dto';
import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Transmission,
} from '@/listing/enums';
import {
   TransformArray,
   TransformBool,
   TransformInt,
} from '@/common/decorators';
import { ListingOrderBy } from '@/listing/enums/listing-order-by.enum';

export class GetListingsRequestDto extends PaginatedRequestDto {
   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   priceMin?: number;

   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   priceMax?: number;

   @ApiProperty({ type: [String], required: false })
   @TransformArray()
   brands?: string[];

   @ApiProperty({ type: [String], required: false })
   @TransformArray()
   models?: string[];

   @ApiProperty({ type: [String], required: false })
   @TransformArray()
   colors?: string[];

   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   yearMin?: number;

   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   yearMax?: number;

   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   mileageMin?: number;

   @ApiProperty({ type: Number, required: false })
   @TransformInt()
   mileageMax?: number;

   @ApiProperty({ type: Date, required: false })
   createdAtMin?: Date;

   @ApiProperty({ type: Date, required: false })
   createdAtMax?: Date;

   @ApiProperty({
      type: [String],
      required: false,
      enum: Transmission,
      enumName: 'TransmissionEnum',
   })
   @TransformArray()
   transmissions?: Transmission[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: Drivetrain,
      enumName: 'DrivetrainEnum',
   })
   @TransformArray()
   drivetrains?: Drivetrain[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: ListingStatus,
      enumName: 'ListingStatusEnum',
   })
   @TransformArray()
   listingStatuses?: ListingStatus[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: CarStatus,
      enumName: 'CarStatusEnum',
   })
   @TransformArray()
   carStatuses?: CarStatus[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: BodyStyle,
      enumName: 'BodyStyleEnum',
   })
   @TransformArray()
   bodyStyles?: BodyStyle[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: FuelType,
      enumName: 'FuelTypeEnum',
   })
   @TransformArray()
   fuelTypes?: FuelType[];

   @ApiProperty({
      type: [String],
      required: false,
      enum: Currency,
      enumName: 'CurrencyEnum',
   })
   @TransformArray()
   currencies?: Currency[];

   @ApiProperty({ type: Boolean, required: false, default: true })
   @TransformBool()
   includeMetadata?: boolean = true;

   @ApiProperty({
      type: String,
      required: false,
      enum: ListingOrderBy,
      enumName: 'ListingOrderByEnum',
   })
   orderBy?: ListingOrderBy;
}
