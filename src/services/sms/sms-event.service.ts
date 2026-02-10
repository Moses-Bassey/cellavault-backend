import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SignUpOtpSmsEvent,
  ForgotPasswordOtpSmsEvent,
} from './events/sms.events';

@Injectable()
export class SmsEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitSignUpOtpSms(phoneNumber: string, otpCode: string) {
    const event = new SignUpOtpSmsEvent(phoneNumber, otpCode);
    this.eventEmitter.emit('sms.signup-otp', event);
  }

  async emitForgotPasswordOtpSms(phoneNumber: string, otpCode: string) {
    const event = new ForgotPasswordOtpSmsEvent(phoneNumber, otpCode);
    this.eventEmitter.emit('sms.forgot-password-otp', event);
  }
}
