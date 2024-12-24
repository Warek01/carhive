export interface AppEnv {
   NODE_ENV: string;

   HTTP_PORT: string;
   HTTP_HOST: string;

   ACCOUNT_SERVICE_URL: string;
   LISTING_SERVICE_URL: string;
   RECOMMENDATION_SERVICE_URL: string;
   SCRAPING_SERVICE_URL: string;
}