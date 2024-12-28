import { SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';

export const BULL_CONFIG: SharedBullAsyncConfiguration = {
   inject: [ConfigService<AppEnv>],
   useFactory: (config: ConfigService<AppEnv>) => ({
      connection: {
         host: config.get('CACHE_HOST'),
         port: parseInt(config.get('CACHE_PORT')!),
      },
   }),
};
