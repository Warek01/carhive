import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   Res,
} from '@nestjs/common';
import {
   ApiBadRequestResponse,
   ApiConflictResponse,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/request/login.dto';
import { RegisterDto } from '@/auth/dto/request/register.dto';
import { Public } from '@/auth/decorators/auth.decorator';
import { UserDto } from '@/user/dto/response/user.dto';
import { AuthCookie } from '@/auth/enums/auth-cookie.enum';

@Controller('auth')
@Public()
@ApiTags('Auth')
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   @ApiOperation({ summary: 'Sign In', description: 'Required role: none' })
   @ApiOkResponse({ type: UserDto })
   async login(
      @Body() body: LoginDto,
      @Res({ passthrough: true }) response: Response,
   ): Promise<UserDto> {
      const data = await this.authService.login(body);
      response.cookie(AuthCookie.AccessToken, data.token, { httpOnly: true });
      return data.user;
   }

   @Post('register')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Sign Up', description: 'Required role: none' })
   @ApiConflictResponse()
   @ApiCreatedResponse({ type: UserDto })
   async register(
      @Body() body: RegisterDto,
      @Res({ passthrough: true }) response: Response,
   ): Promise<UserDto> {
      const data = await this.authService.register(body);
      response.cookie(AuthCookie.AccessToken, data.token, { httpOnly: true });
      return data.user;
   }

   @Post('unauthorize')
   @ApiOperation({
      summary: 'Sign out',
      description: 'Removes the token from cookies',
   })
   unauthorize(@Res({ passthrough: true }) response: Response) {
      response.clearCookie(AuthCookie.AccessToken, { httpOnly: true });
   }
}
