import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserRole } from '@/user/enums/user-role.enum';

@Exclude()
export class UpdateUserDto {
   @Expose()
   @ApiProperty({ type: String })
   username?: string;

   @Expose()
   @ApiProperty({ type: String })
   email?: string;

   @Expose()
   @ApiProperty({ type: String, nullable: true })
   preferences?: string | null;

   @Expose()
   @ApiProperty({ type: String, enum: UserRole })
   role?: UserRole;
}
