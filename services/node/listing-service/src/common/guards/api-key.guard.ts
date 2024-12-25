import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { AppEnv } from '@/common/types/app-env';

@Injectable()
export class ApiKeyGuard implements CanActivate {
   constructor(private readonly config: ConfigService<AppEnv>) {}

   canActivate(context: ExecutionContext): boolean {
      const req: Request = context.switchToHttp().getRequest();
      const key = req.headers['x-api-key'];
      return key === this.config.get('API_KEY');
   }
}
