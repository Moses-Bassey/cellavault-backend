import { Injectable, NotFoundException } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { DriverRepository } from '../repositories/driver.repository';
import { DashboardDto } from 'src/modules/users/dto/user.dto';
import { IDashboard } from 'src/shared/interfaces/dashbaord.interface';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';

@Injectable()
export class DriverService {
  
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly clientDeviceService: ClientDeviceService    
  ) {}

  async dashboard(data: { deviceFCMToken: string, ipAddress: string, name: string }, userId: string): Promise<IDashboard> {
    try{
      const { deviceFCMToken, ipAddress, name } = data;

      const user = await this.driverRepository.findById(userId);
      if (!user){
        throw new NotFoundException('User not found!')
      }

      const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(userId, deviceFCMToken);
      if (clientDevice == null){
        await this.clientDeviceService.registerDevice({
          userId: userId,
          deviceFCMToken: deviceFCMToken,
          ipAddress: ipAddress,
          name: name,
          userType: user.userType as 'DRIVER' | 'USER'
        });
      } else{
        await this.clientDeviceService.updateDeviceToken(clientDevice.id, deviceFCMToken);
      }

      const dashboardRes : IDashboard = {
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.phoneNo,
        userId: user.id
      }
      return dashboardRes;
    }catch(error: unknown){
      throw new NotFoundException('User not found!')
    }
  }


  async fetchDriver(id: string): Promise<Driver | null> {
    const driver = await this.driverRepository.fetchDriver(id);
    if (!driver){
      throw new NotFoundException('Driver not found!')
    }
    return driver;
  }

  async findByIdentity(identity: string): Promise<Driver | null> {
    return await this.driverRepository.findByIdentity(identity);
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await this.driverRepository.findByEmail(email);
  }

  async findAll(options?: any): Promise<Driver[]> {
    return await this.driverRepository.findAll(options);
  }

  async update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]> {
    return await this.driverRepository.update(id, driverData);
  }

  async delete(id: string): Promise<number> {
    return await this.driverRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    return await this.driverRepository.restore(id);
  }
}

