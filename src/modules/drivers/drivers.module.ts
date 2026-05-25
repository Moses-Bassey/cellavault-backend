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
import { AuthDriverController } from './controllers/auth.driver.controller';
import { DriverService } from './services/driver.service';
import { DriverRepository } from './repositories/driver.repository';
import { CountriesModule } from '../countries/countries.module';
import { Country } from '../countries/entities/country.entity';
import { TokenModule } from 'src/services/token/token.module';
import { TripsModule } from '../trips/trips.module';
import { PeppcoinModule } from '../peppcoin/peppcoin.module';

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
    TokenModule,
    TripsModule,
    PeppcoinModule,
  ],
  controllers: [DriverController, AuthDriverController],
  providers: [DriverService, DriverRepository],
  exports: [SequelizeModule, DriverService, DriverRepository],
})
export class DriversModule {}
