import {
   Controller,
   Get,
   Inject,
   Query,
   UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import {
   CACHE_MANAGER,
   CacheInterceptor,
   CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { AiService } from '@/ai/ai.service';
import { AiResponseDto } from '@/ai/dto/response/ai-response.dto';
import { ListingEmbeddingDto } from '@/ai/dto/response/listing-embedding.dto';
import { EmbeddingDto } from '@/ai/dto/response/embedding.dto';
import { Listing } from '@/listing/listing.types';

@Controller('ai')
export class AiController {
   constructor(
      private readonly aiService: AiService,
      @Inject(CACHE_MANAGER) private readonly cache: Cache,
   ) {}

   @Get('generate')
   @CacheTTL(86_400_000) // 1 day
   @ApiOkResponse({ type: AiResponseDto })
   @UseInterceptors(CacheInterceptor)
   @ApiQuery({ name: 'params', required: true, type: String, isArray: true })
   async generate(
      @Query('params') params: string[] | string,
   ): Promise<AiResponseDto> {
      return this.aiService.generate(params);
   }

   @Get('generate/rag')
   @ApiOkResponse({ type: AiResponseDto })
   @ApiQuery({ name: 'query', required: true, type: String, isArray: true })
   async generateRag(@Query('query') query: string): Promise<Listing[]> {
      return this.aiService.generateRag(query);
   }

   @Get('embed/listing')
   @ApiOkResponse({ type: ListingEmbeddingDto })
   @ApiQuery({ name: 'listing', required: true, type: String })
   async summarizeAndEmbed(@Query('listing') listing: string) {
      return this.aiService.summarizeAndEmbedListing(listing);
   }

   @Get('embed/text')
   @ApiOkResponse({ type: EmbeddingDto })
   @ApiQuery({ name: 'text', required: true, type: String })
   async summarizeText(@Query('text') text: string) {
      return this.aiService.embedText(text);
   }
}
