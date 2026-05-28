import { Module } from '@nestjs/common';
import { MapController } from './controllers/map.controller';
import { MapService } from './services/map.service';
import { RedisModule } from '../../services/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
