import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { DriversModule } from '../../modules/drivers/drivers.module';
import { RedisService } from './services/redis.service';

@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
