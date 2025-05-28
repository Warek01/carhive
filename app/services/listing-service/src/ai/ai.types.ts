import { ListingRating } from '@/listing/types/listing-rating.types';

export interface ListingEmbeddingResponse {
   summary: string;
   embedding: number[];
   rating: ListingRating;
}
