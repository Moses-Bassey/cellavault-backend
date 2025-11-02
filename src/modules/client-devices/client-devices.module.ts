import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientDevice } from './entities/client-device.entity';
import { ClientDeviceController } from './controllers/client-device.controller';
import { ClientDeviceService } from './services/client-device.service';
import { ClientDeviceRepository } from './repositories/client-device.repository';
import { ClientDeviceGuard } from './guards/client-device.guard';

@Module({
  imports: [SequelizeModule.forFeature([ClientDevice])],
  controllers: [ClientDeviceController],
  providers: [ClientDeviceService, ClientDeviceRepository, ClientDeviceGuard],
  exports: [ClientDeviceService, ClientDeviceRepository, ClientDeviceGuard],
})
export class ClientDevicesModule {}
