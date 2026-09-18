import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { TutorCreatedEvent } from '../events/tutor.event';
import { MAIL_SUBJECT } from 'src/services/mail/mail.constants';
import { EmailEventService } from 'src/services/mail/email-event.service';

@Injectable()
export class TutorEmailListener {
  private readonly logger = new Logger(TutorEmailListener.name);

  constructor(private readonly emailEventService: EmailEventService) {}

  @OnEvent('tutor.created')
  async handleTutorCreated(event: TutorCreatedEvent) {
    try {
      this.logger.log(`Tutor invite email for ${event.email} processing`);
      // Use the EmailEventService wrapper to keep emission logic centralized
      this.emailEventService.sendTutorInviteEmail({
        email: event.email,
        name: event.name,
        loginUrl: event.loginUrl,
        temporaryPassword: event.temporaryPassword,
      });
    } catch (error) {
      // Listener should be resilient: log and swallow errors so main flow is unaffected
      this.logger.error(`Failed to send tutor invite email to ${event.email}`, error);
    }
  }
}
