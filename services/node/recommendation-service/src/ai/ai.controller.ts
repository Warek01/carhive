import {
   Controller,
   Get,
   Inject,
   ParseArrayPipe,
   Query,
   UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
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
   @ApiOkResponse({ type: AiResponseDto })
   @UseInterceptors(CacheInterceptor)
   async generate(
      @Query('params', ParseArrayPipe) params: string[],
   ): Promise<AiResponseDto> {
      return this.aiService.request(params);
   }
}
