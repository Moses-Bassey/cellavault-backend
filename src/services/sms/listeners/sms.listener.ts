import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SmsService } from '../sms.service';
import { SignUpOtpSmsEvent, ForgotPasswordOtpSmsEvent } from '../events/sms.events';
import { SMS_SUBJECT } from '../sms.constants';

@Injectable()
export class SmsEventListener {
  private readonly logger = new Logger(SmsEventListener.name);

  constructor(private readonly smsService: SmsService) {}

  @OnEvent('sms.signup-otp')
  async handleSignUpOtpEvent(event: SignUpOtpSmsEvent) {
    try {
      this.logger.log(`Sending signup OTP SMS to ${event.phoneNumber}`);
      
      await this.smsService.sendOtp(
        event.phoneNumber,
        event.otpCode,
      );

      this.logger.log(`Signup OTP SMS sent successfully to ${event.phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send signup OTP SMS to ${event.phoneNumber}:`, error);
    }
  }

  @OnEvent('sms.forgot-password-otp')
  async handleForgotPasswordOtpEvent(event: ForgotPasswordOtpSmsEvent) {
    try {
      this.logger.log(`Sending forgot password OTP SMS to ${event.phoneNumber}`);
      
      await this.smsService.sendOtp(
        event.phoneNumber,
        event.otpCode,
      );

      this.logger.log(`Forgot password OTP SMS sent successfully to ${event.phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send forgot password OTP SMS to ${event.phoneNumber}:`, error);
    }
  }
}

