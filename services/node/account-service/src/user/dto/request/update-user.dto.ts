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
   @ApiProperty({ type: Object, nullable: true })
   preferences?: object | null;

   @Expose()
   @ApiProperty({ type: String, enum: UserRole })
   role?: UserRole;
}
