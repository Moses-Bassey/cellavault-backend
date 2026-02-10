import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientDeviceService } from '../services/client-device.service';
import { UserType } from 'src/enums';

@Injectable()
export class ClientDeviceListener {
  constructor(private readonly clientDeviceService: ClientDeviceService) {}

  @OnEvent('addDeviceToken')
  async handleAddDeviceToken(payload: {
    adminId?: string;
    userId?: string;
    driverId?: string;
    ipAddress: string;
    deviceFCMToken?: string | null;
    name?: string | null;
    userType?: UserType;
  }) {
    try {
      await this.clientDeviceService.create({
        adminId: payload.adminId || null,
        userId: payload.userId || null,
        driverId: payload.driverId || null,
        ipAddress: payload.ipAddress,
        deviceFCMToken: payload.deviceFCMToken || null,
        name: payload.name || null,
        userType: payload.userType || undefined,
      });
    } catch (error) {
      console.error('Failed to save client device token', error);
    }
  }
}
