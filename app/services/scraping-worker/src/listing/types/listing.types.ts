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
   bodyStyle?: BodyStyle | null;
   brand?: string | null;
   carStatus?: CarStatus | null;
   color?: string | null;
   currency?: Currency | null;
   description?: string | null;
   drivetrain?: Drivetrain | null;
   fuelType?: FuelType | null;
   images: string[];
   listingStatus?: ListingStatus | null;
   metadata: CreateListingMetadata;
   mileage?: number | null;
   model?: string | null;
   price?: number | null;
   productionYear?: number | null;
   title: string;
   transmission?: Transmission | null;
}

export interface CreateListingMetadata {
   author?: ListingAuthor | null;
   createdAt: string;
   originalId: string;
   platform: Platform;
   url: string;
}

export interface ListingAuthor {
   email?: string | null;
   phoneNumber?: string | null;
   id?: string | null;
   url?: string | null;
   name?: string | null;
}
