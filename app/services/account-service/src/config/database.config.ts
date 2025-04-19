import {
   TypeOrmModuleAsyncOptions,
   TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
   inject: [ConfigService],
   useFactory: (conf: ConfigService<AppEnv>): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: conf.get('DB_HOST'),
      port: conf.get('DB_PORT'),
      database: conf.get('DB_NAME'),
      username: conf.get('DB_USER'),
      password: conf.get('DB_PASSWORD'),
      entities: ['**/*.entity.js'],
      synchronize: true,
   }),
};
