import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('app.emailHost'),
          port: +(configService.get<number>('app.emailPort') || 587),
          secure: false, // true for 465, false for other ports
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
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
