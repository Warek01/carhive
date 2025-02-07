import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { AiResponseDto } from '@/ai/dto/response/ai-response.dto';

@Injectable()
export class AiService {
   private readonly openAi: OpenAI;

   constructor(private readonly config: ConfigService<AppEnv>) {
      this.openAi = new OpenAI({
         apiKey: config.get('OPEN_AI_API_KEY'),
      });
   }

   async request(params: string[]): Promise<AiResponseDto> {
      const response = await this.openAi.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            {
               role: 'developer',
               content: [
                  {
                     type: 'text',
                     text: `As a car recommendation service, provide 10 car models based on the input parameters. 
                     Respond with JSON schema: {cars: {brand: string; model: string}[]". Lowercase letters, no diacritics.`,
                  },
               ],
            },
            {
               role: 'user',
               content: [
                  {
                     type: 'text',
                     text: params.join(','),
                  },
               ],
            },
         ],
         response_format: {
            'type': 'json_object',
         },
         temperature: 0.5,
         max_completion_tokens: 384,
         top_p: 1,
         frequency_penalty: 0,
         store: false,
         presence_penalty: 0,
      });

      const { content } = response.choices[0]?.message;

      if (!content) {
         throw new ServiceUnavailableException('Empty AI response');
      }

      return JSON.parse(content) as AiResponseDto;
   }
}
