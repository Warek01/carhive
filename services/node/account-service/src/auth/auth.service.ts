import { Injectable, Logger } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { User } from '@/user/entities/user.entity';
import { TokenValidationResponseDto } from '@/auth/dto/response/token-validation-response.dto';
import { DecodedJwt } from '@/auth/types/decoded-jwt.types';

@Injectable()
export class AuthService {
   private readonly logger = new Logger(AuthService.name);

   constructor(private readonly jwtService: JwtService) {}

   checkPassword(user: User, password: string): Promise<boolean> {
      return bcrypt.compare(password, user.password);
   }

   async createToken(user: User): Promise<string> {
      const payload = {
         sub: user.id.toString(),
         email: user.email,
         role: user.role,
      };
      return this.jwtService.signAsync(payload);
   }

   async validateToken(token: string): Promise<TokenValidationResponseDto> {
      try {
         const verifyResult =
            await this.jwtService.verifyAsync<DecodedJwt>(token);

         console.log(verifyResult);

         const res = new TokenValidationResponseDto();
         res.valid = true;
         res.decoded = verifyResult;

         return res;
      } catch (err) {
         return this._validateVerifyError(err);
      }
   }

   private _validateVerifyError(err: unknown): TokenValidationResponseDto {
      const res = new TokenValidationResponseDto();
      res.valid = false;

      if (err instanceof JsonWebTokenError) {
         res.error = err;
      } else {
         this.logger.error(err);
      }

      return res;
   }
}
