import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientDevice } from './entities/client-device.entity';
import { ClientDeviceController } from './controllers/client-device.controller';
import { ClientDeviceService } from './services/client-device.service';
import { ClientDeviceRepository } from './repositories/client-device.repository';
import { ClientDeviceGuard } from './guards/client-device.guard';
import { ClientDeviceListener } from './listeners/client-device.listener';
import { ClientDeviceEventEmitter } from './emitters/client-device.emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    SequelizeModule.forFeature([ClientDevice]),
  ],
  controllers: [ClientDeviceController],
  providers: [
    ClientDeviceService,
    ClientDeviceRepository,
    ClientDeviceGuard,
    ClientDeviceListener,
    ClientDeviceEventEmitter,
  ],
  exports: [
    ClientDeviceService,
    ClientDeviceRepository,
    ClientDeviceGuard,
    ClientDeviceEventEmitter,
  ],
})
export class ClientDevicesModule {}
