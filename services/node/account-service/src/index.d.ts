import { AppEnv } from '@/common/types/app-env';

declare global {
   namespace NodeJS {
      interface ProcessEnv extends AppEnv {
      }
   }
}