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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from '../dto/admin.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { AuthAdminService } from '../services/auth.admin.service';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Admin Auth')
@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
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
