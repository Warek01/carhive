import { Controller, Get, Query } from '@nestjs/common';
import {
   ApiOkResponse,
   ApiOperation,
   ApiQuery,
   ApiTags,
} from '@nestjs/swagger';

import { RecommendationService } from '@/recommendation/recommendation.service';
import { AiResponseDto } from '@/recommendation/dto/response/ai-response.dto';

@ApiTags('Recommendation')
@Controller('recommendation')
export class RecommendationController {
   constructor(private readonly recommendationService: RecommendationService) {}

   @Get()
   @ApiOperation({
      summary: 'Get car models recommendations',
      description: 'Roles: <b>User</b>',
   })
   @ApiQuery({ name: 'params', required: true, type: String, isArray: true })
   @ApiOkResponse()
   async generate(
      @Query('params') params: string | string[],
   ): Promise<AiResponseDto> {
      return this.recommendationService.generate(params);
   }
}
