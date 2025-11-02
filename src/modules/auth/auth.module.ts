import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/repositories/user.repository';
import { CountriesModule } from '../countries/countries.module';
import { UsersModule } from '../users/users.module';
import { ClientDeviceService } from '../client-devices/services/client-device.service';
import { ClientDeviceRepository } from '../client-devices/repositories/client-device.repository';
import { ClientDevicesModule } from '../client-devices/client-devices.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    TokenModule,
    MailModule,
    CountriesModule,
    UsersModule,
    ClientDevicesModule
  ],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
