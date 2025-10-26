import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { EmailEventService } from './email-event.service';
import { EmailEventListener } from './listeners/email.listener';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  controllers: [],
  providers: [MailService, EmailEventService, EmailEventListener],
  exports: [MailService, EmailEventService],
  imports: [
    EventEmitterModule.forRoot(),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('app.emailHost'),
          port: +(configService.get<number>('app.emailPort') || 587),
          secure: true, // true for 465, false for other ports
          ignoreTLS: false,
          auth: {
            user: configService.get<string>('app.emailId'), // generated ethereal user
            pass: configService.get<string>('app.emailPass'), // generated ethereal password
          },
        },
        defaults: {
          from: configService.get<string>('app.emailFrom'),
        },
        template: {
          dir: join(process.cwd(), 'src/services/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
