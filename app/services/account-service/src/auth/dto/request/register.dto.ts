import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
   @ApiProperty({ type: String })
   email: string = null!;

   @ApiProperty({ type: String })
   username: string = null!;

   @ApiProperty({ type: String })
   password: string = null!;
}
