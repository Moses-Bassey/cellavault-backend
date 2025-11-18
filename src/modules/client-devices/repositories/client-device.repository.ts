import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { ClientDevice } from '../entities/client-device.entity';

@Injectable()
export class ClientDeviceRepository {
  constructor(
    @InjectModel(ClientDevice)
    private clientDeviceModel: typeof ClientDevice,
  ) {}

  async findById(id: string): Promise<ClientDevice | null> {
    return await this.clientDeviceModel.findByPk(id);
  }

  async findByUserId(userId: string): Promise<ClientDevice[]> {
    return await this.clientDeviceModel.findAll({
      where: { userId },
    });
  }

  async findByIpAddress(ipAddress: string): Promise<ClientDevice[]> {
    return await this.clientDeviceModel.findAll({
      where: { ipAddress },
    });
  }

  async findByDeviceToken(deviceFCMToken: string): Promise<ClientDevice | null> {
    return await this.clientDeviceModel.findOne({
      where: { deviceFCMToken },
    });
  }

  async findAll(options?: any): Promise<ClientDevice[]> {
    return await this.clientDeviceModel.findAll(options);
  }

  async findByUserIdAndDeviceToken(userId: string, deviceFCMToken: string): Promise<ClientDevice | null> {
    const data = await this.clientDeviceModel.findOne({
      where: { userId, deviceFCMToken },
    });
    return data ? (data.toJSON() as ClientDevice) : null;
  } 

  async create(clientDeviceData: Partial<ClientDevice>): Promise<ClientDevice> {
    return await this.clientDeviceModel.create(clientDeviceData as any);
  }

  async update(id: string, clientDeviceData: Partial<ClientDevice>): Promise<[number, ClientDevice[]]> {
    return await this.clientDeviceModel.update(clientDeviceData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.clientDeviceModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    await this.clientDeviceModel.restore({
      where: { id },
    });
  }

  async findByUserAndDevice(userId: string, deviceFCMToken: string): Promise<ClientDevice | null> {
    return await this.clientDeviceModel.findOne({
      where: { 
        userId,
        deviceFCMToken,
      },
    });
  }

  async findByDriverAndDevice(driverId: string, deviceFCMToken: string): Promise<ClientDevice | null> {
    return await this.clientDeviceModel.findOne({
      where: { 
        driverId,
        deviceFCMToken,
      },
    });
  }

  async updateOrCreateDevice(deviceData: Partial<ClientDevice>): Promise<ClientDevice> {
    const { userId, driverId, deviceFCMToken, ipAddress } = deviceData;
    
    if (!deviceFCMToken || !ipAddress) {
      throw new Error('deviceFCMToken and ipAddress are required');
    }

    if (!userId && !driverId) {
      throw new Error('Either userId or driverId must be provided');
    }

    // Find existing device by userId or driverId and device token
    const existingDevice = userId 
      ? await this.findByUserAndDevice(userId, deviceFCMToken)
      : await this.findByDriverAndDevice(driverId!, deviceFCMToken);
    
    if (existingDevice) {
      await this.update(existingDevice.id, deviceData);
      const data = await this.clientDeviceModel.findOne({
        where: {id: existingDevice.id}
      })
      if (data != null)
        return data;
      return existingDevice;
    } else {
      return await this.create(deviceData);
    }
  }
}
