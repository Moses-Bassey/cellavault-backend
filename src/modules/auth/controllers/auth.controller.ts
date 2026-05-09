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
import { CreateAdminDto, AdminLoginDto, LoginOtpDto } from '../dto/auth.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { AuthService } from '../auth.service';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiBearerAuth()
  // @Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
  // @UseGuards(AuthGuard, RolesGuard)
  // @Post('signup')
  // @HttpCode(HttpStatus.OK)
  // async signUp(@Body() input: CreateAdminDto) {
  //   const data = await this.authService.create(input);
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Account created successfully, please await feedback from us',
  //     HttpStatus.CREATED,
  //   );
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: AdminLoginDto, @Req() request: ExpressRequest) {
    const data = await this.authService.login(input, request);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  @Post('login-otp')
  @HttpCode(HttpStatus.OK)
  async loginOtp(@Body() input: LoginOtpDto, @Req() request: ExpressRequest) {
    const data = await this.authService.loginOtp(input, request);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  // @Auth()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  // @Delete()
  // @HttpCode(HttpStatus.OK)
  // async delete(@Body() userCredentials: { email: string; password: string }) {
  //   const { email, password } = userCredentials;
  //   const data = await this.authService.deleteAdminAccount(email, password);
  //   return ResponseUtil.handleResponse(
  //     {},
  //     'Admin account deleted successfully',
  //     HttpStatus.OK,
  //   );
  // }
}
