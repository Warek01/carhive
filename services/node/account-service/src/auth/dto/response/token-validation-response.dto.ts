import { JsonWebTokenError } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { DecodedJwt } from '@/auth/types/decoded-jwt.types';

export class TokenValidationResponseDto {
   @ApiProperty({ type: Boolean })
   valid: boolean = null!;

   @ApiProperty({ type: JsonWebTokenError })
   error: JsonWebTokenError | null = null;

   @ApiProperty()
   decoded: DecodedJwt | null = null;
}
