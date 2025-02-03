export interface AppEnv {
   HTTP_HOST: string;
   HTTP_PORT: string;

   API_KEY: string;

   NODE_ENV: 'development' | 'production';
}
