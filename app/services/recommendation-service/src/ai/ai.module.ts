import { Module } from '@nestjs/common';

import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ListingModule } from '@/listing/listing.module';

@Module({
   imports: [ListingModule],
   controllers: [AiController],
   providers: [AiService],
   exports: [],
})
export class AiModule {}
