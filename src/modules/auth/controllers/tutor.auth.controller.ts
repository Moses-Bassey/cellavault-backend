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
import { JwtAuthPayload } from '../auth.interface';
import { CreateAdminDto, InviteAdminDto, CompleteAdminOnboardingDto, LoginDto, LoginOtpDto } from '../dto/auth.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { AuthService } from '../auth.service';
import { ResponseUtil } from 'src/utils/response.utils';
import { Validators } from 'src/utils/validators.utils';

@ApiTags('Auth')
@Controller('auth/tutor')
export class TutorAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDto) {
    const data = await this.authService.loginTutor(input);
    return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  }

  // @Post('login-otp')
  // @HttpCode(HttpStatus.OK)
  // async loginOtp(@Body() input: LoginOtpDto, @Req() request: ExpressRequest) {
  //   const data = await this.authService.loginOtp(input, request);
  //   return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
  // }

}
