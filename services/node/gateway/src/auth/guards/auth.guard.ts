import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '@/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private readonly authService: AuthService) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
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
