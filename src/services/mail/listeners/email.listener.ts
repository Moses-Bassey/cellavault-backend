import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { MAIL_SUBJECT } from '../mail.constants';
import {
  SignUpOtpEmailEvent,
  ForgetPasswordEmailEvent,
  WelcomeEmailEvent,
  PasswordChangedEmailEvent,
  NewLoginEmailEvent,
  NewDeviceLoginOtpEmailEvent,
  TutorInviteEmailEvent,
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
          expiryDate: event.expiryDate,
        },
      });

      this.logger.log(`Signup OTP email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send signup OTP email to ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent('email.forget-password')
  async handleForgetPasswordEvent(event: ForgetPasswordEmailEvent) {
    try {
      this.logger.log(`Sending forget password email to ${event.otpCode}`);

      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.FORGET_PASSWORD,
        template: 'forget-password',
        context: { otpCode: event.otpCode },
      });

      this.logger.log(
        `Forget password email sent successfully to ${event.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send forget password email to ${event.email}:`,
        error,
      );
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
          email: event.email,
          loginUrl: event.loginUrl,
        },
      });

      this.logger.log(`Welcome email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent('email.password-changed')
  async handlePasswordChangedEvent(event: PasswordChangedEmailEvent) {
    try {
      this.logger.log(`Sending password changed email to ${event.email}`);

      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.PASSWORD_CHANGED,
        template: 'password-changed',
        context: {
          fullName: event.fullName,
          email: event.email,
          changedAt: event.changedAt,
        },
      });

      this.logger.log(
        `Password changed email sent successfully to ${event.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password changed email to ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent('email.new-login')
  async handleNewLoginEvent(event: NewLoginEmailEvent) {
    try {
      this.logger.log(`Sending new login email to ${event.email}`);

      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.NEW_LOGIN,
        template: 'new-login',
        context: {
          fullName: event.fullName,
          email: event.email,
          deviceInfo: event.deviceInfo,
          loginTime: event.loginTime,
          ipAddress: event.ipAddress,
        },
      });

      this.logger.log(`New login email sent successfully to ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send new login email to ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent('email.new-device-login-otp')
  async handleNewDeviceLoginOtpEvent(event: NewDeviceLoginOtpEmailEvent) {
    try {
      this.logger.log(`Sending new device login OTP email to ${event.email}`);

      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.NEW_DEVICE_LOGIN_OTP,
        template: 'new-device-login',
        context: {
          otpCode: event.otpCode,
        },
      });

      this.logger.log(
        `New device login OTP email sent successfully to ${event.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send new device login OTP email to ${event.email}:`,
        error,
      );
    }
  }

  @OnEvent('email.new-tutor-invite')
  async handleTutorInviteEvent(event: TutorInviteEmailEvent) {
    try {
      this.logger.log(`Sending tutor invite email to ${event.email}`);

      const firstName = event.name?.trim().split(' ')[0] ?? 'Tutor';

      await this.mailerService.sendMail({
        to: event.email,
        subject: MAIL_SUBJECT.NEW_TUTOR_INVITE,
        template: 'tutor-invitation', // template name to be implemented
        context: {
          firstName,
          email: event.email,
          loginUrl: event.loginUrl,
          temporaryPassword: event.temporaryPassword,
        },
      });

      this.logger.log(`Tutor invite email sent to ${event.email}`);
    } catch (error) {
      // Log errors but do not rethrow; listener should be resilient
      this.logger.error(`Failed to send tutor invite email to ${event.email}`, error);
    }
  }
}
