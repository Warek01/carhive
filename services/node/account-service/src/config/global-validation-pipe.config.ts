import { ValidationPipeOptions } from '@nestjs/common';

export const globalValidationPipeConfig: ValidationPipeOptions = {
   whitelist: true,
   forbidNonWhitelisted: true,
};
