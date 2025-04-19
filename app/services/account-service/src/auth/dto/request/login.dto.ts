import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
   @ApiProperty({ type: String })
   email: string = null!;

   @ApiProperty({ type: String })
   password: string = null!;
}
