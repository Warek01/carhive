import {
   Body,
   ConflictException,
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
import { AuthDto } from '@/auth/dto/response/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
   constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
   ) {}

   @Post('login')
   async login(@Body() loginDto: LoginDto): Promise<AuthDto> {
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

      const token = await this.authService.createToken(user);

      return plainToInstance(AuthDto, { user, token });
   }

   @Post('register')
   async register(@Body() registerDto: RegisterDto): Promise<AuthDto> {
      const exists = await this.userService.exists(registerDto.username);

      if (exists) {
         throw new ConflictException();
      }

      const user = await this.userService.create({
         email: registerDto.email,
         password: registerDto.password,
         role: UserRole.User,
         username: registerDto.username,
      });
      const token = await this.authService.createToken(user);

      return plainToInstance(AuthDto, { user, token });
   }

   @Get('validate')
   validate(@Query('token') token: string): TokenValidationResponseDto {
      return plainToInstance(
         TokenValidationResponseDto,
         this.authService.validateToken(token),
      );
   }
}
