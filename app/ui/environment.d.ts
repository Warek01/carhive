import 'next';

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NEXT_PUBLIC_API_BASE_URL: string;
         NEXT_PUBLIC_MEDIA_BASE_URL: string;
      }
   }
}
