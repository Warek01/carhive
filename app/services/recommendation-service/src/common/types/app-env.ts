export interface AppEnv {
   HTTP_HOST: string;
   HTTP_PORT: string;

   API_KEY: string;

   OPEN_AI_API_KEY: string;

   CACHE_URL: string;

   NODE_ENV: 'development' | 'production';
}
