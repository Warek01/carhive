import { Controller, Get, Post, Query } from '@nestjs/common';
import {
   ApiOkResponse,
   ApiOperation,
   ApiQuery,
   ApiTags,
} from '@nestjs/swagger';

import { RecommendationService } from '@/recommendation/recommendation.service';
import { AiResponseDto } from '@/recommendation/dto/response/ai-response.dto';
import { Role } from '@/auth/decorators/roles.decroator';
import { UserRole } from '@/user/enums/user-role.enum';
import { ListingDto } from '@/listing/dto/response/listing.dto';

@ApiTags('Recommendation')
@Controller('recommendation')
@Role(UserRole.User)
export class RecommendationController {
   constructor(private readonly recommendationService: RecommendationService) {}

   @Get()
   @ApiOperation({
      summary: 'Get car models recommendations',
      description: 'Roles: <b>User</b>',
   })
   @ApiQuery({ name: 'params', required: true, type: String })
   @ApiOkResponse()
   async generate(@Query('params') params: string): Promise<AiResponseDto> {
      return this.recommendationService.generate(params);
   }

   @Get('rag')
   @ApiOperation({
      summary: 'Get car models recommendations using RAG',
      description: 'Roles: <b>User</b>',
   })
   @ApiQuery({ name: 'input', required: true, type: String })
   async generateRag(@Query('input') input: string): Promise<ListingDto[]> {
      return this.recommendationService.generateRag(input);
   }

   @Post('clear-cache')
   @ApiOperation({
      summary: 'Clear recommendation cache',
      description: 'Roles: <b>User</b>',
   })
   @ApiOkResponse()
   async clearCache(): Promise<void> {
      return this.recommendationService.clearCache();
   }
}
