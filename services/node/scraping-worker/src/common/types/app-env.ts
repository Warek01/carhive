export interface AppEnv {
   SCRAPING_QUEUE_URL: string;

   LISTING_SERVICE_URL: string;
   LISTING_SERVICE_API_KEY: string;

   HTTP_PORT: string;
   HTTP_HOST: string;

   API_KEY: string;

   NODE_ENV: 'development' | 'production';
}
