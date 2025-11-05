import {
    Body,
    Controller,
    Patch,
    Post,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import type { Request as ExpressRequest } from 'express';
  import {
    ChangePasswordDto,
    ForgotPasswordDto,
    LoginOtpDto,
    LoginUserDto,
    ResetPasswordDto,
    SignupEmail,
    SignupPhone,
    VerifyOtpDto,
  } from '../dto/auth.driver.dto';
  import { Auth } from '../../auth/decorators/auth.decorator';
  import { AuthGuard } from '../../auth/guards/auth.guard';
  import { ApiBearerAuth } from '@nestjs/swagger';
  import { AuthDriverService } from '../services/auth.driver.service';
  import { CreateAccountDto } from '../dto/auth.driver.dto';
  
  @Controller('auth/driver')
  export class AuthDriverController {
    constructor(private readonly authService: AuthDriverService) {}
  
    @Post('signup-phone')
    async signUpPhoneNo(@Body() input: SignupPhone) {
      return await this.authService.signUpPhoneNo(input);
    }
  
    @Post('signup-email')
    async signUpEmail(@Body() input: SignupEmail) {
      return await this.authService.signUpEmail(input);
    }
  
    @Post('verify-otp')
    async verifyOtp(@Body() input: VerifyOtpDto) {
      return await this.authService.verifyOtp(input);
    }
  
    @Post('create-account')
    async signUp(@Body() input: CreateAccountDto) {
      return await this.authService.createAccount(input);
    }
  
    @Post('login')
    async login(@Body() input: LoginUserDto) {
      return await this.authService.login(input);
    }
  
    @Post('login-with-otp')
    async loginOtp(@Body() input: LoginOtpDto) {
      return await this.authService.loginOtp(input);
    }
  
    @Post('forgot-password')
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
  