import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from '../admins/admins.module';
import { RedisModule } from '../../services/redis/redis.module';
import { PeppcruiseFees } from './entities/peppcruise-fees.entity';
import { FeesRepository } from './repositories/fees.repository';
import { FeesService } from './services/fees.service';
import { FeeRedisListener } from './listeners/fees.listener';
import { FeesController } from './controllers/fees.controller';

@Module({
  imports: [SequelizeModule.forFeature([PeppcruiseFees]), RedisModule, AdminModule],
  controllers: [FeesController],
  providers: [FeesService, FeesRepository, FeeRedisListener],
  exports: [SequelizeModule],
})
export class FeesModule {}

