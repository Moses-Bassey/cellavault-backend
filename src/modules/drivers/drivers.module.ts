import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Driver } from './entities/driver.entity';
import { Guarantor } from './entities/guarantor.entity';
import { kyc1PersonalInfo } from './entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from './entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from './entities/kyc3-residential-Information.entity';
import { Vehicle } from './entities/vehicle.entity';
import { PeppDriverVehicles } from './entities/pepp-driver-vehicles.entity';
import { VehicleRegistration } from './entities/vehicle-registration.entity';
import { DriverController } from './controllers/driver.controller';
import { GuarantorController } from './controllers/guarantor.controller';
import { KycController } from './controllers/kyc.controller';
import { VehicleRegistrationController } from './controllers/vehicle-registration.controller';
import { DriverService } from './services/driver.service';
import { GuarantorService } from './services/guarantor.service';
import { KycService } from './services/kyc.service';
import { VehicleRegistrationService } from './services/vehicle-registration.service';
import { DriverRepository } from './repositories/driver.repository';
import { GuarantorRepository } from './repositories/guarantor.repository';
import { Kyc1Repository } from './repositories/kyc1.repository';
import { Kyc2Repository } from './repositories/kyc2.repository';
import { Kyc3Repository } from './repositories/kyc3.repository';
import { VehicleRegistrationRepository } from './repositories/vehicle-registration.repository';
import { AuthDriverController } from './controllers/auth.driver.controller';
import { AuthDriverService } from './services/auth.driver.service';
import { CountriesModule } from '../countries/countries.module';
import { Country } from '../countries/entities/country.entity';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { SmsModule } from 'src/services/sms/sms.module';
import { AuthModule } from '../auth/auth.module';
import { ClientDeviceService } from '../client-devices/services/client-device.service';

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
      VehicleRegistration,
      Country,
    ]),
    CountriesModule,
    ClientDevicesModule,
    TokenModule,
    MailModule,
    SmsModule,
    AuthModule,
  ],
  controllers: [
    DriverController,
    GuarantorController,
    KycController,
    AuthDriverController,
    VehicleRegistrationController,
  ],
  providers: [
    DriverService,
    AuthDriverService,
    GuarantorService,
    KycService,
    VehicleRegistrationService,
    DriverRepository,
    GuarantorRepository,
    Kyc1Repository,
    Kyc2Repository,
    Kyc3Repository,
    VehicleRegistrationRepository,
    ClientDeviceService,
  ],
  exports: [
    DriverService,
    GuarantorService,
    KycService,
    VehicleRegistrationService,
    DriverRepository,
    GuarantorRepository,
    Kyc1Repository,
    Kyc2Repository,
    Kyc3Repository,
    VehicleRegistrationRepository,
    ClientDeviceService,
  ],
})
export class DriversModule {}

