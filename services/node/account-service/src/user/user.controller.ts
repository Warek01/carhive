import {
   Body,
   ConflictException,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   NotFoundException,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/request/create-user.dto';
import { UserDto } from '@/user/dto/response/user.dto';
import { UpdateUserDto } from '@/user/dto/request/update-user.dto';
import { User } from '@/user/entities/user.entity';
import { PaginatedRequestDto } from '@/common/dto/request/paginated-request.dto';
import { UsersGetDto } from '@/user/dto/response/users-get.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
   constructor(private readonly _userService: UserService) {}

   @Get(':id')
   async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
      const user = await this._findOneOrNotFound(id);
      return plainToInstance(UserDto, user);
   }

   @Get()
   async get(@Query() requestDto: PaginatedRequestDto): Promise<UsersGetDto> {
      const [users, count] = await this._userService.get(
         requestDto.offset,
         requestDto.limit,
      );

      const dto: Record<keyof UsersGetDto, any> = {
         items: users,
         itemsPerPage: requestDto.limit,
         page: Math.floor(requestDto.offset / requestDto.limit),
         totalItems: count,
      };

      return plainToInstance(UsersGetDto, dto);
   }

   @Post()
   @HttpCode(HttpStatus.CREATED)
   async create(@Body() dto: CreateUserDto) {
      const user = await this._userService.findOneByEmail(dto.email);

      if (user !== null) {
         throw new ConflictException();
      }

      return this._userService.create(dto);
   }

   @Patch(':id')
   async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateDto: UpdateUserDto,
   ): Promise<UserDto> {
      const user = await this._findOneOrNotFound(id);
      await this._userService.update(user, updateDto);
      return plainToInstance(UserDto, user);
   }

   @ApiResponse({ type: UserDto })
   @Delete(':id')
   async delete(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
      const user = await this._findOneOrNotFound(id);
      await this._userService.delete(user);
      return plainToInstance(UserDto, user);
   }

   @ApiResponse({ type: UserDto })
   @Patch(':id/restore')
   async restore(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
      const user = await this._findOneOrNotFound(id);
      await this._userService.restore(user);
      return plainToInstance(UserDto, user);
   }

   /** @throws NotFoundException */
   private async _findOneOrNotFound(id: number): Promise<User> {
      const user = await this._userService.findOne(id);

      if (user === null) {
         throw new NotFoundException();
      }

      return user;
   }
}
