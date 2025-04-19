import { UserRole } from '@/user/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
   @ApiProperty({ type: String })
   email: string = null!;

   @ApiProperty({ type: String })
   password: string = null!;

   @ApiProperty({ type: Number, enum: UserRole })
   role: UserRole = null!;

   @ApiProperty({ type: String })
   username: string = null!;
}
