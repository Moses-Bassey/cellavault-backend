import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() input: LoginUserDto) {
    return await this.authService.login(input);
  }

  @Post('forget-password')
  async forgotPassword(
    @Body() input: ForgotPasswordDto,
    @Request() req: ExpressRequest,
  ) {
    return await this.authService.forgotPassword(input);
  }

  @Patch('reset-password')
  async resetPassword(@Body() input: ResetPasswordDto) {
    return await this.authService.resetPassword(input);
  }

  @Auth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() input: ChangePasswordDto,
    @Request() req: ExpressRequest & { user: any },
  ) {
    return await this.authService.changePassword(input, req.user);
  }
}
