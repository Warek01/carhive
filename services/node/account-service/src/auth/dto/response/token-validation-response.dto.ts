import { JsonWebTokenError } from 'jsonwebtoken';
import { ApiProperty } from '@nestjs/swagger';

export class TokenValidationResponseDto {
   @ApiProperty({ type: Boolean })
   valid: boolean = null!;

   @ApiProperty({ type: JsonWebTokenError })
   error: JsonWebTokenError | null = null;
}
