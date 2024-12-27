import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';

@Module({
   imports: [],
   controllers: [ScraperController],
   providers: [ScraperService],
   exports: [],
})
export class ScraperModule {}
