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

// import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bull';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { RedisQueueService } from './services/redis-queue.service';
// import { ExternalListenerService } from './listeners/mqtt-listener.service';
// import { RedisNotificationListener } from './listeners/redis-notification.listener';
// import { NotificationModule } from '../../modules/notification/notification.module';
// import { redis } from './redis.client';
// import * as dotenv from 'dotenv';
// dotenv.config();

// console.log(
//   `env values: ${process.env.REDIS_PORT}, ${process.env.REDIS_HOST}, ${process.env.REDIS_USERNAME}, ${process.env.REDIS_PASSWORD},  ${process.env.REDIS_TLS}`,
// );

// @Module({
//   imports: [
//     NotificationModule,
//     BullModule.registerQueue({
//       name: 'notifications',
//       redis: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT),
//         username: process.env.REDIS_USERNAME,
//         password: process.env.REDIS_PASSWORD,
//         tls: undefined,
//       },
//       //   redis: process.env.REDIS_URL,
//     }),
//     EventEmitterModule.forRoot(),
//   ],
//   providers: [
//     RedisQueueService,
//     RedisNotificationListener,
//     {
//       provide: 'REDIS_CLIENT',
//       useValue: redis,
//     },
//   ],
//   controllers: [ExternalListenerService],
//   exports: [RedisQueueService, 'REDIS_CLIENT'],
// })
// ex
