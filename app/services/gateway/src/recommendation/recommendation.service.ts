import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { BaseMicroserviceService } from '@/common/classes/base-microservice-service';
import { AiResponseDto } from '@/recommendation/dto/response/ai-response.dto';
import { ListingDto } from '@/listing/dto/response/listing.dto';

@Injectable()
export class RecommendationService extends BaseMicroserviceService {
   constructor(httpService: HttpService) {
      super(httpService, new Logger(RecommendationService.name));
   }

   generate(params: string | string[]): Promise<AiResponseDto> {
      return this.forwardRequest({
         url: 'ai/generate',
         method: 'GET',
         params: { params },
      });
   }

   clearCache(): Promise<void> {
      return this.forwardRequest({
         url: 'cache',
         method: 'POST',
      });
   }

   generateRag(input: string): Promise<ListingDto[]> {
      return this.forwardRequest({
         url: 'ai/generate/rag',
         method: 'GET',
         params: { query: input },
      });
   }
}
