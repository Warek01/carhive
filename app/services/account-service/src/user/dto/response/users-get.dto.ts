import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UserDto } from '@/user/dto/response/user.dto';
import { PaginatedResponseDto } from '@/common/dto/response/paginated-response.dto';

export class UsersGetDto extends PaginatedResponseDto<UserDto> {
   @ApiProperty({ type: [UserDto] })
   @Type(() => UserDto)
   items: UserDto[] = null!;
}
