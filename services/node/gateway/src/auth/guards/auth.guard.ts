import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

import { AuthService } from '@/auth/auth.service';
import { IS_PUBLIC_DECORATOR_KEY } from '@/auth/decorators/auth.decorator';
import { AuthCookie } from '@/auth/enums/auth-cookie.enum';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly authService: AuthService,
      private readonly reflector: Reflector,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
         IS_PUBLIC_DECORATOR_KEY,
         [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
         return true;
      }

      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      const response = httpContext.getResponse<Response>();
      const token = request.cookies[AuthCookie.AccessToken];

      if (!token) {
         throw new UnauthorizedException();
      }

      const result = await this.authService.validate(token);

      // Get rid of token if expired or other mismatches
      if (!result.valid) {
         response.clearCookie(AuthCookie.AccessToken, { httpOnly: true });
         throw new UnauthorizedException(result.error);
      }

      (request as any)['user'] = result.decoded;

      return true;
   }
}
