import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

// Transforms the value into an integer
export const TransformInt = () =>
   applyDecorators(
      Transform(({ value }) =>
         typeof value === 'string' ? parseInt(value) : value,
      ),
   );
