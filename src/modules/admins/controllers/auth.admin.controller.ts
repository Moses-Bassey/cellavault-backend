import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from '../dto/admin.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthAdminService } from '../services/auth.admin.service';
import { ResponseUtil } from 'src/utils/response.utils';

@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() input: CreateAdminDto) {
    const data = await this.authService.create(input);
    return ResponseUtil.handleResponse(
      data,
      'Account created successfully, please await feedback from us',
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: AdminLoginDto, @Req() request: Request) {
    const data = await this.authService.login(input, request);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  @Post('login-otp')
  @HttpCode(HttpStatus.OK)
  async loginOtp(@Body() input: LoginOtpDto, @Req() request: Request) {
    const data = await this.authService.loginOtp(input, request);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  @Auth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Body() userCredentials: { email: string; password: string }) {
    const { email, password } = userCredentials;
    const data = await this.authService.deleteAdminAccount(email, password);
    return ResponseUtil.handleResponse(
      {},
      'Admin account deleted successfully',
      HttpStatus.OK,
    );
  }
}
