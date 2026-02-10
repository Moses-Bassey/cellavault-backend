import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MAIL_SUBJECT } from './mail.constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgetPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_SUBJECT.SIGN_UP_OTP,
      template: 'forget-password',
      context: { resetLink },
    });
  }

  async sendSignUpOtpEmail(
    email: string,
    otpCode: string,
    expiryDate: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_SUBJECT.SIGN_UP_OTP,
      template: 'signup-otp',
      context: { otpCode, expiryDate },
    });
  }
}
