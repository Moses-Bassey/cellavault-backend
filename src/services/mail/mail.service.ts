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
      subject: MAIL_SUBJECT.RESET_PASSWORD,
      template: 'forget-password',
      context: { resetLink },
    });
  }

  async sendOrgOnboardingEmail(
    email: string,
    invitationLink: string,
    expiryDate: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_SUBJECT.ORG_ONBOARDING,
      template: 'org-invitation',
      context: { invitationLink, expiryDate },
    });
  }
}
