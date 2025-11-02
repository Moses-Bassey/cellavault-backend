import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SignUpOtpEmailEvent,
  ForgetPasswordEmailEvent,
  WelcomeEmailEvent,
  BookingConfirmationEmailEvent,
  DriverVerificationEmailEvent,
  PasswordChangedEmailEvent,
  NewLoginEmailEvent,
  NewDeviceLoginOtpEmailEvent,
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

  async emitWelcomeEmail(email: string, fullName: string) {
    const event = new WelcomeEmailEvent(email, fullName);
    this.eventEmitter.emit('email.welcome', event);
  }

  async emitBookingConfirmationEmail(
    email: string,
    bookingId: string,
    driverName: string,
    pickupTime: string,
    pickupLocation: string,
  ) {
    const event = new BookingConfirmationEmailEvent(
      email,
      bookingId,
      driverName,
      pickupTime,
      pickupLocation,
    );
    this.eventEmitter.emit('email.booking-confirmation', event);
  }

  async emitDriverVerificationEmail(
    email: string,
    fullName: string,
    verificationStatus: 'approved' | 'rejected',
    reason?: string,
  ) {
    const event = new DriverVerificationEmailEvent(
      email,
      fullName,
      verificationStatus,
      reason,
    );
    this.eventEmitter.emit('email.driver-verification', event);
  }

  async emitPasswordChangedEmail(email: string, fullName: string, changedAt: string) {
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
    const event = new NewLoginEmailEvent(email, fullName, deviceInfo, loginTime, ipAddress);
    this.eventEmitter.emit('email.new-login', event);
  }

  async emitNewDeviceLoginOtpEmail(email: string, otpCode: string) {
    const event = new NewDeviceLoginOtpEmailEvent(email, otpCode);
    this.eventEmitter.emit('email.new-device-login-otp', event);
  }
}
