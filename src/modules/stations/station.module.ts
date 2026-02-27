// src/modules/stations/stations.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CngStation } from './entities/cng-station.entity';
import { CngFuelingStation } from './entities/cng-fueling-station.entity';
import { ChargingStation } from './entities/charging-station.entity';
import { StationRepository } from './repositories/station.repository';
import { StationService } from './services/station.service';
import { StationController } from './controllers/station.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CngStation,
      CngFuelingStation,
      ChargingStation,
    ]),
  ],
  providers: [StationRepository, StationService],
  controllers: [StationController],
})
export class StationsModule {}
