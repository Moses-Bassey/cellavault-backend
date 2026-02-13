import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { TripsModule } from '../trips/trips.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ClientDevicesModule,
    TripsModule,
    PaymentModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
