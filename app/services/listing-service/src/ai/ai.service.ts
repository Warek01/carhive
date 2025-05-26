import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { BaseMicroserviceService } from '@/common/classes/classes/base-microservice-service';
import { Listing } from '@/listing/entities/listing.entity';
import { ListingEmbeddingResponse } from '@/ai/ai.types';

@Injectable()
export class AiService extends BaseMicroserviceService {
   constructor(httpService: HttpService) {
      super(httpService, new Logger(AiService.name));
   }

   getEmbedding(listing: Listing): Promise<ListingEmbeddingResponse> {
      return this.forwardRequest({
         url: 'embed/listing',
         method: 'GET',
         params: {
            listing: this.stringifyListingForSummary(listing),
         },
      });
   }

   private stringifyListingForSummary(listing: Listing): string {
      const parts: string[] = [];

      const add = (label: string, value?: string | number | null) => {
         if (value !== undefined && value !== null && value !== '') {
            parts.push(`${label}: ${value}`);
         }
      };

      add('Title', listing.title);
      add('Description', listing.description);
      add('Brand', listing.brand);
      add('Model', listing.model);
      add('Year', listing.productionYear);
      add(
         'Price',
         listing.price ? `${listing.price} ${listing.currency ?? ''}` : null,
      );
      add('Color', listing.color);
      add('Mileage', listing.mileage);
      add('Transmission', listing.transmission);
      add('Fuel Type', listing.fuelType);
      add('Drivetrain', listing.drivetrain);
      add('Body Style', listing.bodyStyle);

      return parts.join(' | ');
   }
}
