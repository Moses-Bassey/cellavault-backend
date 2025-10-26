import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SmsService } from './sms.service';
import { SmsEventService } from './sms-event.service';
import { SmsEventListener } from './listeners/sms.listener';

@Global()
@Module({
  controllers: [],
  providers: [SmsService, SmsEventService, SmsEventListener],
  exports: [SmsService, SmsEventService],
  imports: [EventEmitterModule.forRoot()],
})
export class SmsModule {}

