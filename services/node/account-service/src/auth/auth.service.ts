import { Injectable, Logger } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

import { User } from '@/user/entities/user.entity';
import { TokenValidationResponseDto } from '@/auth/dto/response/token-validation-response.dto';
import { AppEnv } from '@/common/types/app-env';

@Injectable()
export class AuthService {
   private readonly _logger = new Logger(AuthService.name);
   private readonly _secret: string;
   private readonly _expiresIn: string;
   private readonly _signOptions: jwt.SignOptions;
   private readonly _verifyOptions: jwt.VerifyOptions;
   private readonly _audience = 'carhive';
   private readonly _issuer = 'carhive';

   constructor(config: ConfigService<AppEnv>) {
      this._secret = config.get('JWT_SECRET')!;
      this._expiresIn = config.get('JWT_EXPIRES_IN')!;

      this._signOptions = {
         expiresIn: this._expiresIn,
         audience: this._audience,
         issuer: this._issuer,
      };

      this._verifyOptions = {
         audience: this._audience,
         issuer: this._issuer,
      };
   }

   checkPassword(user: User, password: string): Promise<boolean> {
      return bcrypt.compare(password, user.password);
   }

   createToken(user: User): string {
      const payload: jwt.JwtPayload = {
         sub: user.id.toString(),
         email: user.email,
         role: user.role,
      };
      return jwt.sign(payload, this._secret, this._signOptions);
   }

   validateToken(token: string): TokenValidationResponseDto {
      try {
         jwt.verify(token, this._secret, this._verifyOptions);
         return {
            valid: true,
            error: null,
         };
      } catch (err) {
         return this._validateVerifyError(err);
      }
   }

   private _validateVerifyError(err: unknown): TokenValidationResponseDto {
      if (err instanceof jwt.JsonWebTokenError) {
         return {
            valid: false,
            error: err,
         };
      } else {
         this._logger.error(err);
         return {
            valid: false,
            error: null,
         };
      }
   }
}
