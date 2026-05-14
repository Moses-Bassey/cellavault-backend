import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { TripsModule } from '../trips/trips.module';
import { PeppcoinModule } from '../peppcoin/peppcoin.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), TripsModule, PeppcoinModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [SequelizeModule, UserService, UserRepository],
})
export class UsersModule {}
