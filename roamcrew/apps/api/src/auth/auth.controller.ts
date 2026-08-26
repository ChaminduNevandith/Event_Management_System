import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { LoginSchema, RegisterSchema } from 'contracts';
import type { LoginRequest, RegisterRequest } from 'contracts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() loginDto: LoginRequest) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() registerDto: RegisterRequest) {
    return this.authService.register(registerDto);
  }
}
