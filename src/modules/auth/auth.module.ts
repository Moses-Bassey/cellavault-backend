import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { AuthController } from './controllers/auth.controller';
import { AuthListener } from './listeners/auth.listener';
import { AuthService } from './auth.service';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { AdminModule } from '../admins/admin.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TokenModule,
    MailModule,
    AdminModule,
    ClientDevicesModule,
  ],
  providers: [AuthService, AuthListener],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
