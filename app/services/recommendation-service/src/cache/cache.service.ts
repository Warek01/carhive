import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createKeyv, Keyv } from '@keyv/redis';

import { AppEnv } from '@/common/types/app-env';

@Injectable()
export class CacheService {
   private readonly keyv: Keyv;

   constructor(private readonly config: ConfigService<AppEnv>) {
      this.keyv = createKeyv({ url: config.get('CACHE_URL') });
   }

   async clear() {
      await this.keyv.clear();
   }
}
