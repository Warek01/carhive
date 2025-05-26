import { EmbeddingModel } from 'openai/resources/embeddings';
import { ChatModel } from 'openai/resources/chat/chat';

export interface AppEnv {
   HTTP_HOST: string;
   HTTP_PORT: string;
   API_KEY: string;
   OPEN_AI_API_KEY: string;
   CACHE_URL: string;
   EMBEDDING_MODEL: EmbeddingModel;
   CHAT_MODEL: ChatModel;
   LISTING_SERVICE_API_KEY: string;
   LISTING_SERVICE_URL: string;
   NODE_ENV: 'development' | 'production';
}
