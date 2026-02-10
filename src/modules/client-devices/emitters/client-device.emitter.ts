import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserType } from 'src/enums';

@Injectable()
export class ClientDeviceEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Emit an event to save a client device asynchronously.
   * @param payload Fields for the ClientDevice entity
   */
  emitAddDeviceToken(payload: {
    adminId?: string;
    userId?: string;
    driverId?: string;
    ipAddress: string;
    deviceFCMToken?: string | null;
    name?: string | null;
    userType?: UserType | null;
  }) {
    this.eventEmitter.emit('addDeviceToken', payload);
  }
}
