import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { AuthController } from './controllers/auth.controller';
import { AuthListener } from './listeners/auth.listener';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TokenModule,
    MailModule,
    UserModule
  ],
  providers: [AuthService, AuthListener],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
