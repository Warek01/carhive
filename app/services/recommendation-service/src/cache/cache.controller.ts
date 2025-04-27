import { Controller, Post } from '@nestjs/common';

import { CacheService } from '@/cache/cache.service';

@Controller('cache')
export class CacheController {
   constructor(private readonly cacheService: CacheService) {}

   @Post()
   clear() {
      return this.cacheService.clear();
   }
}
