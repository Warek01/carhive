import {
   BadRequestException,
   Injectable,
   ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { APIPromise } from 'openai/core';
import { ConfigService } from '@nestjs/config';

import { AppEnv } from '@/common/types/app-env';
import { AiResponseDto } from '@/ai/dto/response/ai-response.dto';
import { ListingEmbeddingDto } from '@/ai/dto/response/listing-embedding.dto';
import { ListingService } from '@/listing/listing.service';
import { Listing } from '@/listing/listing.types';

@Injectable()
export class AiService {
   private readonly openAi: OpenAI;

   constructor(
      private readonly config: ConfigService<AppEnv>,
      private readonly listingService: ListingService,
   ) {
      this.openAi = new OpenAI({
         apiKey: config.get('OPEN_AI_API_KEY'),
         dangerouslyAllowBrowser: false,
      });
   }

   async summarizeAndEmbedListing(input: string): Promise<ListingEmbeddingDto> {
      const [summary, rating] = await Promise.all([
         this.getListingSummary(input),
         this.getListingRating(input),
      ]);
      const embedding = await this.embedText(summary);

      return {
         summary,
         rating,
         embedding,
      };
   }

   private async getListingSummary(jsonListing: string): Promise<string> {
      const response = await this.openAi.responses.create({
         model: 'gpt-4o-mini',
         input: [
            {
               role: 'system',
               content: [
                  {
                     type: 'input_text',
                     text: `You are a summarizer for AI-powered car search.

Given a pipe-delimited string of key listing fields (like Brand, Model, Price, etc.), write a short and descriptive summary. Focus on what kind of buyer this car suits, how it drives, style, perceived value, and practical traits (like reliability or affordability).

Don’t repeat field labels or raw values unless they carry meaning. Instead, infer characteristics like “sporty”, “budget-friendly”, “family car”, “luxury for men”, “European car for youth”, or “simple and reliable”. Avoid fluff or formal language. Output will be used for vector similarity search with queries like:

- “cheap reliable car”
- “european car for youth”
- “luxury car for men”

Be descriptive and compact, with rich semantic meaning.
`,

                     // text: 'You’re a car reviewer. Given JSON-formatted listing data (consider relevant features, not ones like links or ids), write a short, direct summary. Focus on value, condition, style, and usefulness. Use plain, descriptive language—no fluff or formal phrasing.',
                  },
               ],
            },
            {
               role: 'user',
               content: jsonListing,
            },
         ],
         text: {
            format: {
               type: 'text',
            },
         },
         reasoning: {},
         tools: [],
         temperature: 0.5,
         max_output_tokens: 384,
         top_p: 1,
         store: true,
      });

      return response.output_text;
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
         model: this.config.get('CHAT_MODEL')!,
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
         store: true,
      });
   }

   async embedText(input: string): Promise<number[]> {
      const res = await this.openAi.embeddings.create({
         input,
         model: this.config.get('EMBEDDING_MODEL')!,
         encoding_format: 'float',
      });

      return res.data[0].embedding;
   }

   async generateRag(query: string): Promise<Listing[]> {
      const embeddedQuery = await this.embedText(query);
      const listings =
         await this.listingService.similaritySearch(embeddedQuery);

      return listings.items;
   }

   async getListingRating(listing: string) {
      const response = await this.openAi.responses.create({
         model: this.config.get('CHAT_MODEL')!,
         input: [
            {
               'role': 'system',
               'content': [
                  {
                     'type': 'input_text',
                     'text':
                        'You are a car reviewer. Given the car sale description, rate at a scale from 1 to 10 (0.1 step size) how good this listing is',
                  },
               ],
            },
            {
               role: 'user',
               content: listing,
            },
         ],
         text: {
            'format': {
               'type': 'json_schema',
               'name': 'rating_scale',
               'strict': true,
               'schema': {
                  'type': 'object',
                  'properties': {
                     'overall': {
                        'type': 'number',
                        'description':
                           'Overall rating of the item on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'mileage': {
                        'type': 'number',
                        'description':
                           'Mileage rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'price': {
                        'type': 'number',
                        'description':
                           'Price rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'reliability': {
                        'type': 'number',
                        'description':
                           'Reliability rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'sport': {
                        'type': 'number',
                        'description':
                           'Sportiness rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'offroad': {
                        'type': 'number',
                        'description':
                           'Off-road capability rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'family': {
                        'type': 'number',
                        'description':
                           'Family suitability rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'luxury': {
                        'type': 'number',
                        'description':
                           'Luxury rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                     'fuelEfficiency': {
                        'type': 'number',
                        'description':
                           'Fuel efficiency rating on a scale from 1 to 10 with a step size of 0.1.',
                     },
                  },
                  'required': [
                     'overall',
                     'mileage',
                     'price',
                     'reliability',
                     'sport',
                     'offroad',
                     'family',
                     'luxury',
                     'fuelEfficiency',
                  ],
                  'additionalProperties': false,
               },
            },
         },
         reasoning: {},
         tools: [],
         temperature: 0.5,
         max_output_tokens: 2048,
         top_p: 1,
         store: true,
      });

      return JSON.parse(response.output_text);
   }
}
