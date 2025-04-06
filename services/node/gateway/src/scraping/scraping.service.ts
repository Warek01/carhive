import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { BaseMicroserviceService } from '@/common/classes/base-microservice-service';
import { ScrapePlatformRequestDto } from '@/scraping/dto/request/scrape-platform-request.dto';

@Injectable()
export class ScrapingService extends BaseMicroserviceService {
   constructor(httpService: HttpService) {
      super(httpService, new Logger(ScrapingService.name));
   }

   scrapePage(dto: ScrapePlatformRequestDto): Promise<void> {
      return this.forwardRequest({
         url: 'scrape-platform',
         method: 'POST',
         params: dto,
      });
   }
}
