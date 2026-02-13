import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Trip } from './entities/trip.entity';
import { TripRepository } from './repositories/trip.repository';

@Module({
  imports: [SequelizeModule.forFeature([Trip])],
  providers: [TripRepository],
  exports: [TripRepository, SequelizeModule],
})
export class TripsModule {}
