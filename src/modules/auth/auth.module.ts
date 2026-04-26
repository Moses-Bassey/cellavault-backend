import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { AdminModule } from '../admins/admins.module';

@Module({
  imports: [
    TokenModule,
    MailModule,
    AdminModule,
    ClientDevicesModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
