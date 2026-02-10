import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientDevice } from '../entities/client-device.entity';
import { ClientDeviceRepository } from '../repositories/client-device.repository';
import { UserType } from 'src/enums';

@Injectable()
export class ClientDeviceService {
  constructor(
    private readonly clientDeviceRepository: ClientDeviceRepository,
  ) {}

  async findById(id: string): Promise<ClientDevice | null> {
    return await this.clientDeviceRepository.findById(id);
  }

  async findByUserId(userId: string) {
    const devices = await this.clientDeviceRepository.findByUserId(userId);
    return devices;
  }

  async findByIpAddress(ipAddress: string) {
    const devices =
      await this.clientDeviceRepository.findByIpAddress(ipAddress);
    return devices;
  }

  async findByUserIdAndDeviceToken(
    userId: string,
    deviceFCMToken: string,
  ): Promise<ClientDevice | null> {
    return await this.clientDeviceRepository.findByAdminIdAndDeviceToken(
      userId,
      deviceFCMToken,
    );
  }

  async findByDriverIdAndDeviceToken(
    driverId: string,
    deviceFCMToken: string,
  ): Promise<ClientDevice | null> {
    return await this.clientDeviceRepository.findByDriverAndDevice(
      driverId,
      deviceFCMToken,
    );
  }

  async findAll(options?: any) {
    const devices = await this.clientDeviceRepository.findAll(options);
    return devices;
  }

  async create(clientDeviceData: Partial<ClientDevice>): Promise<ClientDevice> {
    return await this.clientDeviceRepository.create(clientDeviceData);
  }

  async update(
    id: string,
    clientDeviceData: Partial<ClientDevice>,
  ): Promise<[number, ClientDevice[]]> {
    return await this.clientDeviceRepository.update(id, clientDeviceData);
  }

  async delete(id: string): Promise<number> {
    return await this.clientDeviceRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.clientDeviceRepository.restore(id);
  }

  async registerDevice(deviceData: {
    ipAddress: string;
    deviceFCMToken?: string;
    name?: string;
    userId?: string;
    driverId?: string;
    userType?: UserType;
  }) {
    const device =
      await this.clientDeviceRepository.updateOrCreateDevice(deviceData);
    return device;
  }

  async updateDeviceToken(clientDeviceId: string, deviceFCMToken: string) {
    const [affectedCount, updatedDevices] =
      await this.clientDeviceRepository.update(clientDeviceId, {
        deviceFCMToken,
      });

    if (affectedCount === 0) {
      throw new NotFoundException('Device not found!');
    }

    return updatedDevices[0];
  }
}
