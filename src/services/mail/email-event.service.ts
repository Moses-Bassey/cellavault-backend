import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SignUpOtpEmailEvent,
  ForgetPasswordEmailEvent,
  WelcomeEmailEvent,
  PasswordChangedEmailEvent,
  NewLoginEmailEvent,
  NewDeviceLoginOtpEmailEvent,
  TutorInviteEmailEvent,
} from './events/email.events';

@Injectable()
export class EmailEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitSignUpOtpEmail(email: string, otpCode: string, expiryDate: string) {
    const event = new SignUpOtpEmailEvent(email, otpCode, expiryDate);
    this.eventEmitter.emit('email.signup-otp', event);
  }

  async emitForgetPasswordEmail(email: string, otp: string) {
    const event = new ForgetPasswordEmailEvent(email, otp);
    this.eventEmitter.emit('email.forget-password', event);
  }

  async emitWelcomeEmail(email: string, fullName: string, loginUrl: string) {
    const event = new WelcomeEmailEvent(email, fullName, loginUrl);
    this.eventEmitter.emit('email.welcome', event);
  }

  async emitPasswordChangedEmail(
    email: string,
    fullName: string,
    changedAt: string,
  ) {
    const event = new PasswordChangedEmailEvent(email, fullName, changedAt);
    this.eventEmitter.emit('email.password-changed', event);
  }

  async emitNewLoginEmail(
    email: string,
    fullName: string,
    deviceInfo: string,
    loginTime: string,
    ipAddress?: string,
  ) {
    const event = new NewLoginEmailEvent(
      email,
      fullName,
      deviceInfo,
      loginTime,
      ipAddress,
    );
    this.eventEmitter.emit('email.new-login', event);
  }

  async emitNewDeviceLoginOtpEmail(email: string, otpCode: string) {
    const event = new NewDeviceLoginOtpEmailEvent(email, otpCode);
    this.eventEmitter.emit('email.new-device-login-otp', event);
  }

  sendTutorInviteEmail(payload: {
    email: string;
    name: string;
    loginUrl: string;
    temporaryPassword: string;
  }) {
    const { email, name, loginUrl, temporaryPassword } = payload;
    const event = new TutorInviteEmailEvent(email, name, loginUrl, temporaryPassword);
    // synchronous emit is fine for fire-and-forget; listener handles actual sending
    this.eventEmitter.emit('email.new-tutor-invite', event);
  }
}

