import {
   CarStatus,
   Currency,
   Drivetrain,
   ListingStatus,
   Transmission,
   BodyStyle,
   FuelType,
} from '@/listing/enums';

export interface Listing {
   id: number;
   updatedAt: Date;
   createdAt: Date;
   images: string[];
   title: string;
   productionYear?: number;
   description?: string;
   brand?: string;
   model?: string;
   price?: number;
   currency?: Currency;
   color?: string;
   listingStatus: ListingStatus;
   carStatus?: CarStatus;
   bodyStyle?: BodyStyle;
   drivetrain?: Drivetrain;
   fuelType?: FuelType;
   transmission?: Transmission;
   metadata?: ListingMetadata;
}

export interface ListingMetadata {
   listingId: number;
   originalId: string;
   url: string;
   createdAt: Date;
   author?: ListingAuthor;
}

export interface ListingAuthor {
   email?: string;
   phoneNumber?: string;
   id?: string;
   url?: string;
   name?: string;
}
