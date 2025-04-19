import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '@/user/dto/response/user.dto';

export class AuthDto {
   @Type(() => UserDto)
   @ApiProperty({ type: UserDto })
   user: UserDto;

   @ApiProperty({ type: String })
   token: string;
}
