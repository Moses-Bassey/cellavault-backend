import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { MAIL_SUBJECT } from '../mail.constants';
import {
  SignUpOtpEmailEvent,
  ForgetPasswordEmailEvent,
  WelcomeEmailEvent,
  BookingConfirmationEmailEvent,
  DriverVerificationEmailEvent,
} from '../events/email.events';

@Injectable()
export class EmailEventListener {
  private readonly logger = new Logger(EmailEventListener.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('email.signup-otp')
  async handleSignUpOtpEvent(event: SignUpOtpEmailEvent) {
    try {
      this.logger.log(`Sending signup OTP email to ${event.email}`);
      
      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.SIGN_UP_OTP,
        template: 'sign-up-otp',
        context: { 
          otpCode: event.otpCode, 
          expiryDate: event.expiryDate 
        },
      });

      this.logger.log(`Signup OTP email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to send signup OTP email to ${event.email}:`, error);
    }
  }

  @OnEvent('email.forget-password')
  async handleForgetPasswordEvent(event: ForgetPasswordEmailEvent) {
    try {
      this.logger.log(`Sending forget password email to ${event.email}`);
      
      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.FORGET_PASSWORD,
        template: 'forget-password',
        context: { resetLink: event.resetLink },
      });

      this.logger.log(`Forget password email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to send forget password email to ${event.email}:`, error);
    }
  }

  @OnEvent('email.welcome')
  async handleWelcomeEvent(event: WelcomeEmailEvent) {
    try {
      this.logger.log(`Sending welcome email to ${event.email}`);
      
      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.WELCOME,
        template: 'welcome',
        context: { 
          fullName: event.fullName,
          email: event.email 
        },
      });

      this.logger.log(`Welcome email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${event.email}:`, error);
    }
  }

  @OnEvent('email.booking-confirmation')
  async handleBookingConfirmationEvent(event: BookingConfirmationEmailEvent) {
    try {
      this.logger.log(`Sending booking confirmation email to ${event.email}`);
      
      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.BOOKING_CONFIRMATION,
        template: 'booking-confirmation',
        context: { 
          bookingId: event.bookingId,
          driverName: event.driverName,
          pickupTime: event.pickupTime,
          pickupLocation: event.pickupLocation,
        },
      });

      this.logger.log(`Booking confirmation email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation email to ${event.email}:`, error);
    }
  }

  @OnEvent('email.driver-verification')
  async handleDriverVerificationEvent(event: DriverVerificationEmailEvent) {
    try {
      this.logger.log(`Sending driver verification email to ${event.email}`);
      
      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.DRIVER_VERIFICATION,
        template: 'driver-verification',
        context: { 
          fullName: event.fullName,
          verificationStatus: event.verificationStatus,
          reason: event.reason,
        },
      });

      this.logger.log(`Driver verification email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to send driver verification email to ${event.email}:`, error);
    }
  }
}
