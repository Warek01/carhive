export interface AppEnv {
   DB_USER: string;
   DB_PASSWORD: string;
   DB_NAME: string;
   DB_HOST: string;
   DB_PORT: string;

   HTTP_HOST: string;
   HTTP_PORT: string;

   API_KEY: string;
   QUEUE_URL: string;

   NODE_ENV: 'development' | 'production';
}
