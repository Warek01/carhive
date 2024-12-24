import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
   BadRequestException,
   ConflictException,
   ForbiddenException,
   GoneException,
   ImATeapotException,
   InternalServerErrorException,
   Logger,
   MethodNotAllowedException,
   NotAcceptableException,
   NotFoundException,
   PayloadTooLargeException,
   RequestTimeoutException,
   UnauthorizedException,
   UnsupportedMediaTypeException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';

/** Handles requests that should be forwarded to a microservice */
export abstract class BaseMicroserviceService {
   protected readonly httpService: HttpService;
   protected abstract readonly logger: Logger;

   protected constructor(httpService: HttpService) {
      this.httpService = httpService;
   }

   protected async forwardRequest<TResponse>(
      config: AxiosRequestConfig,
   ): Promise<TResponse> {
      try {
         const response$ = this.httpService.request<TResponse>(config);
         const response = await firstValueFrom(response$);
         return response.data;
      } catch (err) {
         this._throwIfAxiosClientError(err);
         this.logger.error(err);
         throw new InternalServerErrorException();
      }
   }

   private _throwIfAxiosClientError(err: unknown): void {
      if (
         err instanceof AxiosError &&
         err.response!.status >= 400 &&
         err.response!.status < 500
      ) {
         const message = err.response?.data.message;

         switch (err.response!.status) {
            case 400:
               throw new BadRequestException(message);
            case 401:
               throw new UnauthorizedException(message);
            case 403:
               throw new ForbiddenException(message);
            case 404:
               throw new NotFoundException(message);
            case 405:
               throw new MethodNotAllowedException(message);
            case 406:
               throw new NotAcceptableException(message);
            case 408:
               throw new RequestTimeoutException(message);
            case 409:
               throw new ConflictException(message);
            case 410:
               throw new GoneException(message);
            case 413:
               throw new PayloadTooLargeException(message);
            case 415:
               throw new UnsupportedMediaTypeException(message);
            case 418:
               throw new ImATeapotException(message);
         }
      }
   }
}
