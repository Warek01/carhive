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
import { Public } from '@/auth/decorators/auth.decorator';

@Controller('auth')
@Public()
@ApiTags('Auth')
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
export class AuthController {
   constructor(private readonly _authService: AuthService) {}

   @Post('login')
   @ApiOperation({ summary: 'Sign In', description: 'Required role: none' })
   @ApiOkResponse({ type: String })
   login(@Body() body: LoginDto): Promise<string> {
      return this._authService.login(body);
   }

   @Post('register')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Sign Up', description: 'Required role: none' })
   @ApiConflictResponse()
   @ApiCreatedResponse({ type: String })
   register(@Body() body: RegisterDto): Promise<string> {
      return this._authService.register(body);
   }
}
