import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';
import { ConfigService } from '@nestjs/config';

import { File } from './types/file.types';
import { AppEnv } from '@/common/types/app-env.types';

@Injectable()
export class MediaService {
   constructor(private readonly config: ConfigService<AppEnv>) {
   }

   async createFiles(files: File[] | File): Promise<void> {
      if (Array.isArray(files)) {
         await Promise.all(files.map((file) => this.create(file)));
      } else {
         await this.create(files);
      }
   }

   private async create(file: File): Promise<void> {
      await fs.writeFile(
         path.join(this.config.get('STORAGE_PATH')!, file.name),
         file.multerFile.buffer,
      );
   }
}
