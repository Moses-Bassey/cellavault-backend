import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
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
    LoginDriverDto,
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
  import { ResponseUtil } from 'src/utils/response.utils';
  
  @Controller('auth/drivers')
  export class AuthDriverController {
    constructor(private readonly authService: AuthDriverService) {}
  
    @Post('signup-phone')
    @HttpCode(HttpStatus.OK)
    async signUpPhoneNo(@Body() input: SignupPhone) {
      const data = await this.authService.signUpPhoneNo(input);
      return ResponseUtil.handleResponse(data, 'Sign up OTP has been sent to your phoneNo', HttpStatus.OK);
    }
  
    @Post('signup-email')
    @HttpCode(HttpStatus.OK)
    async signUpEmail(@Body() input: SignupEmail) {
      const data = await this.authService.signUpEmail(input);
      return ResponseUtil.handleResponse(data, 'Sign up OTP has been sent to your email', HttpStatus.OK);
    }
  
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() input: VerifyOtpDto) {
      const data = await this.authService.verifyOtp(input);
      return ResponseUtil.handleResponse(data, 'OTP Validated successfully', HttpStatus.OK);
    }
  
    @Post('create-account')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() input: CreateAccountDto) {
      const data = await this.authService.createAccount(input);
      return ResponseUtil.handleResponse(data, 'Account created successfully', HttpStatus.CREATED);
    }
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() input: LoginDriverDto) {
      const data = await this.authService.login(input);
      return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
    }
  
    @Post('login-with-otp')
    @HttpCode(HttpStatus.OK)
    async loginOtp(@Body() input: LoginOtpDto) {
      const data = await this.authService.loginOtp(input);
      return ResponseUtil.handleResponse(data, 'Login successful', HttpStatus.OK);
    }
  
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(
      @Body() input: ForgotPasswordDto,
      @Request() req: ExpressRequest,
    ) {
      const data = await this.authService.forgotPassword(input);
      return ResponseUtil.handleResponse(data, 'Forgot password request successful', HttpStatus.OK);
    }
  
    @Patch('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() input: ResetPasswordDto) {
      const data = await this.authService.resetPassword(input);
      return ResponseUtil.handleResponse(data, 'Password reset successful', HttpStatus.OK);
    }
  
    @Auth()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(
      @Body() input: ChangePasswordDto,
      @Request() req: ExpressRequest & { user: any },
    ) {
      const data = await this.authService.changePassword(input, req.user);
      return ResponseUtil.handleResponse(data, 'Password changed successfully', HttpStatus.OK);
    }
  }
  