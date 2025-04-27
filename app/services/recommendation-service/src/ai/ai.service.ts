import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
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

   async generate(params: string[] | string): Promise<AiResponseDto> {
      const prompt: string = Array.isArray(params) ? params.join(',') : params;
      const response = await this.makeRequest(prompt);
      const { content } = response.choices[0]?.message;

      if (!content) {
         throw new ServiceUnavailableException('Empty AI response');
      }

      return JSON.parse(content) as AiResponseDto;
   }

   private makeRequest(
      prompt: string,
   ): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
      return this.openAi.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            {
               role: 'developer',
               content: [
                  {
                     type: 'text',
                     text: 'As a car recommendation service, provide 15 car models based on the given prompt. Use lowercase letters, no diacritics.',
                  },
               ],
            },
            {
               role: 'user',
               content: [
                  {
                     type: 'text',
                     text: prompt,
                  },
               ],
            },
         ],
         response_format: {
            type: 'json_schema',
            json_schema: {
               name: 'cars',
               strict: true,
               schema: {
                  type: 'object',
                  properties: {
                     cars: {
                        type: 'array',
                        description: 'A list of car objects.',
                        items: {
                           type: 'object',
                           properties: {
                              brand: {
                                 type: 'string',
                                 description: 'The brand of the car.',
                              },
                              model: {
                                 type: 'string',
                                 description: 'The model of the car.',
                              },
                           },
                           required: ['brand', 'model'],
                           additionalProperties: false,
                        },
                     },
                  },
                  required: ['cars'],
                  additionalProperties: false,
               },
            },
         },
         temperature: 0.8,
         max_completion_tokens: 2048,
         frequency_penalty: 0,
         presence_penalty: 0,
         store: false,
      });
   }
}
