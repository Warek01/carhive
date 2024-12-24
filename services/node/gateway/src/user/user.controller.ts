import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
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
import { AuthGuard } from '@/auth/guards/auth.guard';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiNotFoundResponse()
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@ApiBadRequestResponse()
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get(':id')
   @ApiOperation({ summary: 'Get user details' })
   @ApiOkResponse({ type: UserDto })

   getOne(@Param('id') id: number): Promise<UserDto> {
      return this.userService.getOne(id);
   }

   @Patch(':id')
   @ApiOperation({ summary: 'Update a user' })
   @ApiOkResponse({ type: UserDto })
   update(
      @Param('id') id: number,
      @Body() updateDto: UpdateUserDto,
   ): Promise<UserDto> {
      return this.userService.update(id, updateDto);
   }

   @Delete(':id')
   @ApiOperation({ summary: 'Soft delete a user' })
   @ApiOkResponse({ type: UserDto })
   delete(@Param('id') id: number): Promise<UserDto> {
      return this.userService.delete(id);
   }

   @Get('')
   @ApiOperation({ summary: 'Get multiple users' })
   @ApiOkResponse({ type: UsersGetDto })
   get(@Query() queryDto: PaginatedRequestDto): Promise<UsersGetDto> {
      return this.userService.get(queryDto);
   }

   @Post('')
   @ApiOperation({ summary: 'Create a user' })
   @ApiOkResponse({ type: UserDto })
   create(@Body() createDto: CreateUserDto): Promise<UserDto> {
      return this.userService.create(createDto);
   }

   @Patch(':id/restore')
   @ApiOperation({ summary: 'Restore a soft deleted user' })
   @ApiOkResponse({ type: UserDto })
   restore(@Param('id') id: number): Promise<UserDto> {
      return this.userService.restore(id);
   }
}
