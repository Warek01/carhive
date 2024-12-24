import {
   Body,
   Controller,
   Get,
   NotFoundException,
   Post,
   Query,
   UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { TokenValidationResponseDto } from '@/auth/dto/response/token-validation-response.dto';
import { LoginDto } from '@/auth/dto/request/login.dto';
import { RegisterDto } from '@/auth/dto/request/register.dto';
import { UserRole } from '@/user/enums/user-role.enum';
import { UserDto } from '@/user/dto/response/user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
   constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
   ) {}

   @Post('login')
   async login(@Body() loginDto: LoginDto) {
      const user = await this.userService.findOneByEmail(loginDto.email);

      if (user === null) {
         throw new NotFoundException();
      }

      const passwordCorrect = await this.authService.checkPassword(
         user,
         loginDto.password,
      );

      if (!passwordCorrect) {
         throw new UnauthorizedException();
      }

      return this.authService.createToken(user);
   }

   @Post('register')
   async register(@Body() registerDto: RegisterDto) {
      const user = await this.userService.create({
         email: registerDto.email,
         password: registerDto.password,
         role: UserRole.User,
         username: registerDto.username,
      });

      return plainToInstance(UserDto, user);
   }

   @Get('validate')
   validate(@Query('token') token: string) {
      return plainToInstance(
         TokenValidationResponseDto,
         this.authService.validateToken(token),
      );
   }
}
