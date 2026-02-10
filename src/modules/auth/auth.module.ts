import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { User } from '../users/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/repositories/user.repository';
import { CountriesModule } from '../countries/countries.module';
import { UsersModule } from '../users/users.module';
import { ClientDeviceService } from '../client-devices/services/client-device.service';
import { ClientDeviceRepository } from '../client-devices/repositories/client-device.repository';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { Passcode } from './entities/passcode.entity';
import { PasscodeRepository } from './repositories/passcode.repository';
import { PasscodeService } from './services/passcode.service';
import { PasscodeController } from './controllers/passcode.controller';
import { Driver } from '../drivers/entities/driver.entity';
import { DriverRepository } from '../drivers/repositories/driver.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Passcode, Driver]),
    TokenModule,
    MailModule,
    CountriesModule,
    UsersModule,
    ClientDevicesModule,
  ],
  providers: [
    AuthService,
    UserRepository,
    PasscodeService,
    PasscodeRepository,
    DriverRepository,
  ],
  controllers: [AuthController, PasscodeController],
  exports: [PasscodeService, PasscodeRepository],
})
export class AuthModule {}
