import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ClientDevice } from '../entities/client-device.entity';
import { ClientDeviceRepository } from '../repositories/client-device.repository';
import { ApiResponse, ResponseUtil } from 'src/utils/response.utils';

@Injectable()
export class ClientDeviceService {
  constructor(private readonly clientDeviceRepository: ClientDeviceRepository) {}

  async findById(id: string): Promise<ClientDevice | null> {
    return await this.clientDeviceRepository.findById(id);
  }

  async findByUserId(userId: string) {
    try {
      const devices = await this.clientDeviceRepository.findByUserId(userId);
      return ResponseUtil.success(devices, 'User devices retrieved successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred while retrieving user devices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIpAddress(ipAddress: string) {
    try {
      const devices = await this.clientDeviceRepository.findByIpAddress(ipAddress);
      return ResponseUtil.success(devices, 'Devices by IP retrieved successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred while retrieving devices by IP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByDeviceToken(deviceFCMToken: string): Promise<ClientDevice | null> {
    return await this.clientDeviceRepository.findByDeviceToken(deviceFCMToken);
  }

  async findAll(options?: any) {
    try {
      const devices = await this.clientDeviceRepository.findAll(options);
      return ResponseUtil.success(devices, 'Client devices retrieved successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred during find all client devices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(clientDeviceData: Partial<ClientDevice>): Promise<ClientDevice> {
    return await this.clientDeviceRepository.create(clientDeviceData);
  }

  async update(id: string, clientDeviceData: Partial<ClientDevice>): Promise<[number, ClientDevice[]]> {
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
    userType?: 'SUPER_ADMIN' | 'PEPP_ADMIN' | 'USER';
  }) {
    try {
      const device = await this.clientDeviceRepository.updateOrCreateDevice(deviceData);
      return ResponseUtil.success(device, 'Device registered successfully', HttpStatus.CREATED);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred while registering device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDeviceToken(deviceId: string, deviceFCMToken: string) {
    try {
      const [affectedCount, updatedDevices] = await this.clientDeviceRepository.update(deviceId, {
        deviceFCMToken,
      });
      
      if (affectedCount === 0) {
        throw new NotFoundException('Device not found!')
      }

      return ResponseUtil.success(
        updatedDevices[0],
        'Device token updated successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred while updating device token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
