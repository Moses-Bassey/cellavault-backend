import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Admin } from '../admins/entities/admin.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { User } from '../users/entities/user.entity';
import { ClientDevice } from '../client-devices/entities/client-device.entity';
import { RedisModule } from '../../services/redis/redis.module';

import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';
import { ActivityRepository } from './repositories/activity.repository';
import { AdminActivityInterceptor } from '../../interceptors/admin-activity.interceptor';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin, Driver, User, ClientDevice]),
    RedisModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, AdminActivityInterceptor],
  exports: [ActivityService, AdminActivityInterceptor],
})
export class ActivityModule {}