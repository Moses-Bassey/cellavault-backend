import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Driver } from './entities/driver.entity';
import { Guarantor } from './entities/guarantor.entity';
import { kyc1PersonalInfo } from './entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from './entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from './entities/kyc3-residential-Information.entity';
import { Vehicle } from './entities/vehicle.entity';
import { PeppDriverVehicles } from './entities/pepp-driver-vehicles.entity';
import { DriverController } from './controllers/driver.controller';
import { GuarantorController } from './controllers/guarantor.controller';
import { DriverService } from './services/driver.service';
import { GuarantorService } from './services/guarantor.service';
import { DriverRepository } from './repositories/driver.repository';
import { GuarantorRepository } from './repositories/guarantor.repository';
import { AuthDriverController } from './controllers/auth.driver.controller';
import { AuthDriverService } from './services/auth.driver.service';
import { CountriesModule } from '../countries/countries.module';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { SmsModule } from 'src/services/sms/sms.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Driver,
      Guarantor,
      kyc1PersonalInfo,
      kyc2IdInformation,
      kyc3ResidentialInformation,
      Vehicle,
      PeppDriverVehicles,
    ]),
    CountriesModule,
    ClientDevicesModule,
    TokenModule,
    MailModule,
    SmsModule,
  ],
  controllers: [DriverController, GuarantorController, AuthDriverController],
  providers: [DriverService, AuthDriverService, GuarantorService, DriverRepository, GuarantorRepository],
  exports: [DriverService, GuarantorService, DriverRepository, GuarantorRepository],
})
export class DriversModule {}

