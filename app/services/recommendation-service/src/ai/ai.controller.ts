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
}
