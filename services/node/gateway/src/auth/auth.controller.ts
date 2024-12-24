import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
   ApiBadRequestResponse,
   ApiConflictResponse,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
export class AuthController {
   constructor(private readonly _authService: AuthService) {}

   @Post('login')
   @ApiOperation({ summary: 'Sign In' })
   @ApiOkResponse({ type: String })
   login(@Body() body: LoginDto): Promise<string> {
      return this._authService.login(body);
   }

   @Post('register')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Sign Up' })
   @ApiConflictResponse()
   @ApiCreatedResponse({ type: String })
   register(@Body() body: RegisterDto): Promise<string> {
      return this._authService.register(body);
   }
}
