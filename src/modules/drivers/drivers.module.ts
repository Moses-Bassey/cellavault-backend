import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Driver } from './entities/driver.entity';
import { Guarantor } from './entities/guarantor.entity';
import { DriverController } from './controllers/driver.controller';
import { GuarantorController } from './controllers/guarantor.controller';
import { DriverService } from './services/driver.service';
import { GuarantorService } from './services/guarantor.service';
import { DriverRepository } from './repositories/driver.repository';
import { GuarantorRepository } from './repositories/guarantor.repository';

@Module({
  imports: [SequelizeModule.forFeature([Driver, Guarantor])],
  controllers: [DriverController, GuarantorController],
  providers: [DriverService, GuarantorService, DriverRepository, GuarantorRepository],
  exports: [DriverService, GuarantorService, DriverRepository, GuarantorRepository],
})
export class DriversModule {}

