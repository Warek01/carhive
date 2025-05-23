import { BodyStyle, CarStatus, Currency, Drivetrain, FuelType, ListingOrderBy, ListingStatus, Transmission } from '@/enums/listing';
import { Platform } from '@/enums/scraping';
import { PaginatedRequest } from '@/types/api';





interface BaseListingGetRequest {
   includeMetadata: boolean;
}

export interface ListingFilter {
   bodyStyles?: BodyStyle[];
   brands?: string[];
   carStatuses?: CarStatus[];
   colors?: string[];
   createdAtMax?: Date;
   createdAtMin?: Date;
   currencies?: Currency[];
   drivetrains?: Drivetrain[];
   fuelTypes?: FuelType[];
   listingStatuses?: ListingStatus[];
   mileageMax?: number;
   mileageMin?: number;
   models?: string[];
   priceMax?: number;
   priceMin?: number;
   transmissions?: Transmission[];
   yearMax?: number;
   yearMin?: number;
   orderBy: ListingOrderBy;
}

export interface ListingGetParams
   extends BaseListingGetRequest,
      ListingFilter,
      PaginatedRequest {}

export interface ListingFindParams extends BaseListingGetRequest {}

export interface Listing {
   bodyStyle?: BodyStyle;
   brand?: string;
   carStatus?: CarStatus;
   color?: string;
   createdAt: string;
   currency?: Currency;
   description?: string;
   drivetrain?: Drivetrain;
   fuelType?: FuelType;
   id: number;
   images: string[];
   listingStatus: ListingStatus;
   metadata?: ListingMetadata;
   mileage?: number;
   model?: string;
   price?: number;
   productionYear?: number;
   title: string;
   transmission?: Transmission;
   updatedAt: string;
}

export interface ListingMetadata {
   author?: ListingAuthor;
   createdAt: string;
   listingId: number;
   originalId: string;
   platform: Platform;
   url: string;
}

export interface ListingAuthor {
   email?: string;
   id?: string;
   name?: string;
   phoneNumber?: string;
   url?: string;
}

export interface CreateListing {
   bodyStyle?: BodyStyle;
   brand?: string;
   carStatus?: CarStatus;
   color?: string;
   currency?: Currency;
   description?: string;
   drivetrain?: Drivetrain;
   fuelType?: FuelType;
   images: File[];
   listingStatus?: ListingStatus;
   model?: string;
   price?: number;
   productionYear?: number;
   title: string;
   transmission?: Transmission;
   mileage?: number;

   metadataAuthor?: ListingAuthor;
   metadataCreatedAt: string;
   metadataOriginalId?: string;
   metadataPlatform?: Platform;
   metadataUrl?: string;
}
