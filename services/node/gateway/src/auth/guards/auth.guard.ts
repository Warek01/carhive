import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { AuthService } from '@/auth/auth.service';
import { IS_PUBLIC_DECORATOR_KEY } from '@/auth/decorators/auth.decorator';

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

      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
         throw new UnauthorizedException();
      }

      const result = await this.authService.validate(token);

      if (!result.valid) {
         throw new UnauthorizedException(result.error);
      }

      (request as any)['user'] = result.decoded;

      return true;
   }

   private extractTokenFromHeader(request: Request): string | null {
      const header: string | null = request.headers.authorization ?? null;
      const [type, token] = header?.split(' ') ?? [];
      return type === 'Bearer' ? token : null;
   }
}
