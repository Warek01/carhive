import {
   BodyStyle,
   CarStatus,
   Currency,
   Drivetrain,
   FuelType,
   ListingOrderBy,
   ListingStatus,
   Transmission,
} from '@/enums/listing';
import { Platform } from '@/enums/scraping';
import { PaginatedRequest } from '@/types/api';

interface BaseListingGetRequest {
   includeMetadata: boolean;
}

interface ListingFilter {
   priceMin?: number;
   priceMax?: number;
   brands?: string[];
   models?: string[];
   colors?: string[];
   yearMin?: number;
   yearMax?: number;
   mileageMin?: number;
   mileageMax?: number;
   createdAtMin?: Date;
   createdAtMax?: Date;
   transmissions?: Transmission[];
   drivetrains?: Drivetrain[];
   listingStatuses?: ListingStatus[];
   carStatuses?: CarStatus[];
   bodyStyles?: BodyStyle[];
   fuelTypes?: FuelType[];
   currencies?: Currency[];
}

export interface ListingGetParams
   extends BaseListingGetRequest,
      ListingFilter,
      PaginatedRequest {
   orderBy: ListingOrderBy;
}

export interface ListingFindParams extends BaseListingGetRequest {}

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

export interface CreateListing {
   images: string[];
   title: string;
   metadata: CreateListingMetadata;
   description?: string;
   productionYear?: number;
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
   currency?: Currency;
}

export interface CreateListingMetadata {
   originalId: string;
   url: string;
   createdAt: Date;
   platform: Platform;
   author?: ListingAuthor;
}
