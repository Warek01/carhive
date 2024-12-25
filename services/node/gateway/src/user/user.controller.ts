import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
} from '@nestjs/common';
import {
   ApiBadRequestResponse,
   ApiBearerAuth,
   ApiForbiddenResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from '@/user/user.service';
import { UserDto } from '@/user/dto/response/user.dto';
import { UpdateUserDto } from '@/user/dto/request/update-user.dto';
import { PaginatedRequestDto } from '@/common/dto/request/paginated-request.dto';
import { UsersGetDto } from '@/user/dto/response/users-get.dto';
import { CreateUserDto } from '@/user/dto/request/create-user.dto';
import { Role } from '@/auth/decorators/roles.decroator';
import { UserRole } from '@/user/enums/user-role.enum';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@ApiBadRequestResponse()
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get(':id')
   @Role(UserRole.User)
   @ApiOperation({
      summary: 'Get user details',
      description: 'Required role: <b>User</b>',
   })
   @ApiOkResponse({ type: UserDto })
   getOne(@Param('id') id: number): Promise<UserDto> {
      return this.userService.getOne(id);
   }

   @Patch(':id')
   @Role(UserRole.Admin)
   @ApiOperation({
      summary: 'Update a user',
      description: 'Required role: <b>Admin</b>',
   })
   @ApiOkResponse({ type: UserDto })
   update(
      @Param('id') id: number,
      @Body() updateDto: UpdateUserDto,
   ): Promise<UserDto> {
      return this.userService.update(id, updateDto);
   }

   @Delete(':id')
   @Role(UserRole.Admin)
   @ApiOperation({
      summary: 'Soft delete a user',
      description: 'Required role: <b>Admin</b>',
   })
   @ApiOkResponse({ type: UserDto })
   delete(@Param('id') id: number): Promise<UserDto> {
      return this.userService.delete(id);
   }

   @Get('')
   @Role(UserRole.User)
   @ApiOperation({
      summary: 'Get multiple users',
      description: 'Required role: <b>User</b>',
   })
   @ApiOkResponse({ type: UsersGetDto })
   get(@Query() queryDto: PaginatedRequestDto): Promise<UsersGetDto> {
      return this.userService.get(queryDto);
   }

   @Post('')
   @Role(UserRole.Admin)
   @ApiOperation({
      summary: 'Create a user',
      description: 'Required role: <b>Admin</b>',
   })
   @ApiOkResponse({ type: UserDto })
   create(@Body() createDto: CreateUserDto): Promise<UserDto> {
      return this.userService.create(createDto);
   }

   @Patch(':id/restore')
   @Role(UserRole.Admin)
   @ApiOperation({
      summary: 'Restore a soft deleted user',
      description: 'Required role: <b>Admin</b>',
   })
   @ApiOkResponse({ type: UserDto })
   restore(@Param('id') id: number): Promise<UserDto> {
      return this.userService.restore(id);
   }
}
