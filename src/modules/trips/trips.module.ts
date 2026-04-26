import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Trip } from './entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { TripRepository } from './repositories/trip.repository';
import { TripController } from './controllers/trip.controller';
import { TripService } from './services/trip.service';

@Module({
  imports: [SequelizeModule.forFeature([Trip, User, Driver])],
  controllers: [TripController],
  providers: [TripRepository, TripService],
  exports: [TripRepository, SequelizeModule, TripService],
})
export class TripsModule {}
