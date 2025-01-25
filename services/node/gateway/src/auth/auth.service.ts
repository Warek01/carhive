import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { LoginDto } from '@/auth/dto/request/login.dto';
import { RegisterDto } from '@/auth/dto/request/register.dto';
import { BaseMicroserviceService } from '@/common/classes/base-microservice-service';
import { TokenValidationResponse } from '@/auth/types/token-validation-response.types';
import { authEndpoints } from '@/auth/constants/auth-endpoints.constants';
import { AuthResponse } from '@/auth/types/auth-response.types';

@Injectable()
export class AuthService extends BaseMicroserviceService {
   protected readonly logger = new Logger(AuthService.name);

   constructor(httpService: HttpService) {
      super(httpService);
   }

   login(dto: LoginDto): Promise<AuthResponse> {
      return this.forwardRequest({
         url: authEndpoints.login(),
         method: 'POST',
         data: dto,
      });
   }

   register(dto: RegisterDto): Promise<AuthResponse> {
      return this.forwardRequest({
         url: authEndpoints.register(),
         method: 'POST',
         data: dto,
      });
   }

   async validate(token: string): Promise<TokenValidationResponse> {
      return this.forwardRequest({
         url: authEndpoints.validate(),
         params: { token },
         method: 'GET',
      });
   }
}
