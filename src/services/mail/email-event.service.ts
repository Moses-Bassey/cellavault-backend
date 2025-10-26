import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SignUpOtpEmailEvent,
  ForgetPasswordEmailEvent,
  WelcomeEmailEvent,
  BookingConfirmationEmailEvent,
  DriverVerificationEmailEvent,
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
}
