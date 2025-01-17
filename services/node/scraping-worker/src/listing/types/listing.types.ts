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
   title: string;
   metadata: CreateListingMetadata;
   productionYear?: number | null;
   currency?: Currency | null;
   description?: string | null;
   brand?: string | null;
   model?: string | null;
   price?: number | null;
   color?: string | null;
   carStatus?: CarStatus | null;
   bodyStyle?: BodyStyle | null;
   drivetrain?: Drivetrain | null;
   fuelType?: FuelType | null;
   transmission?: Transmission | null;
   listingStatus?: ListingStatus | null;
}

export interface CreateListingMetadata {
   originalId: string;
   platform: Platform;
   url: string;
   createdAt: Date;
   author?: ListingAuthor | null;
}

export interface ListingAuthor {
   email?: string | null;
   phoneNumber?: string | null;
   id?: string | null;
   url?: string | null;
   name?: string | null;
}
