import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingStatus,
   Transmission,
   Platform,
} from '@/listing/enums';

export interface CreateListing {
   images: string[];
   metadata: CreateListingMetadata;
   currency?: Currency;
   description?: string;
   brand?: string;
   model?: string;
   price?: number;
   color?: string;
   carStatus?: CarStatus;
   bodyStyle?: BodyStyle;
   drivetrain?: Drivetrain;
   fuelType?: FuelType;
   transmission?: Transmission;
   listingStatus?: ListingStatus;
}

export interface CreateListingMetadata {
   originalId: string;
   platform: Platform;
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
