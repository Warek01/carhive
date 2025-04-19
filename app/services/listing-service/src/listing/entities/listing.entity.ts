import {
   Column,
   CreateDateColumn,
   Entity,
   Index,
   OneToOne,
   PrimaryGeneratedColumn,
   Relation,
   UpdateDateColumn,
} from 'typeorm';

import { ListingStatus } from '@/listing/enums/listing-status.enum';
import { CarStatus } from '@/listing/enums/car-status.enum';
import { BodyStyle } from '@/listing/enums/body-style.enum';
import { Drivetrain } from '@/listing/enums/drivetrain.enum';
import { FuelType } from '@/listing/enums/fuel-type.enum';
import { Transmission } from '@/listing/enums/transmission.enum';
import { ListingMetadata } from '@/listing/entities/listing-metadata.entity';
import { Currency } from '@/listing/enums/currency.enum';

@Entity('listings')
export class Listing {
   @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
   id: number;

   @UpdateDateColumn({ name: 'updated_at' })
   updatedAt: Date;

   @CreateDateColumn({ name: 'created_at' })
   createdAt: Date;

   @Column({ name: 'images', array: true, type: 'varchar' })
   images: string[];

   @Column({ name: 'title' })
   title: string;

   @Column({ name: 'production_year', nullable: true, type: 'int' })
   productionYear?: number;

   @OneToOne(() => ListingMetadata, (m) => m.listing)
   metadata?: Relation<ListingMetadata>;

   @Column({ name: 'description', type: 'text', nullable: true })
   description?: string;

   @Column({ name: 'brand', length: 255, nullable: true })
   @Index()
   brand?: string;

   @Column({ name: 'model', length: 255, nullable: true })
   @Index()
   model?: string;

   @Column({ name: 'price', type: 'double precision', nullable: true })
   price?: number;

   @Column({
      name: 'currency',
      type: 'enum',
      nullable: true,
      enum: Currency,
      enumName: 'currency',
   })
   currency?: Currency;

   @Column({ name: 'color', length: 255, nullable: true })
   color?: string;

   @Column({
      name: 'listing_status',
      type: 'enum',
      enum: ListingStatus,
      enumName: 'listing_status',
   })
   listingStatus: ListingStatus = ListingStatus.Draft;

   @Column({
      name: 'car_status',
      type: 'enum',
      enum: CarStatus,
      enumName: 'car_status',
      nullable: true,
   })
   carStatus?: CarStatus;

   @Column({
      name: 'body_style',
      type: 'enum',
      enum: BodyStyle,
      enumName: 'body_style',
      nullable: true,
   })
   bodyStyle?: BodyStyle;

   @Column({ name: 'mileage', type: 'int', nullable: true })
   mileage?: number;

   @Column({
      name: 'drivetrain',
      type: 'enum',
      enum: Drivetrain,
      enumName: 'drivetrain',
      nullable: true,
   })
   drivetrain?: Drivetrain;

   @Column({
      name: 'fuel_type',
      type: 'enum',
      enum: FuelType,
      enumName: 'fuel_type',
      nullable: true,
   })
   fuelType?: FuelType;

   @Column({
      name: 'transmission',
      type: 'enum',
      enum: Transmission,
      enumName: 'transmission',
      nullable: true,
   })
   transmission?: Transmission;
}
