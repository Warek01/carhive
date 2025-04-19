import { Module } from '@nestjs/common';

import { ScraperService } from '@/scraper/scraper.service';
import { ScraperController } from '@/scraper/scraper.controller';
import { ListingModule } from '@/listing/listing.module';

@Module({
   imports: [ListingModule],
   controllers: [ScraperController],
   providers: [ScraperService],
   exports: [],
})
export class ScraperModule {}
