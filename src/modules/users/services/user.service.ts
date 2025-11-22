import { Injectable, NotFoundException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import { DashboardDto } from '../dto/user.dto';
import { DriverService } from 'src/modules/drivers/services/driver.service';
import { IDashboard, IDashboardInput } from 'src/shared/interfaces/dashbaord.interface';

@Injectable()
export class UserService {
  
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientDeviceService: ClientDeviceService,
    private readonly configService: ConfigService,
  ) {}  

  async fetchUser(id: string): Promise<User | null> {
    try{
      const user = await this.userRepository.fetchUser(id)
      if (!user){
        throw new NotFoundException('User not found!')
      }
      return user;
    }catch(error: unknown){
      throw new NotFoundException('User not found!')
    }
  }

  async findByIdentity(identity: string): Promise<User | null> {
    try{
      const user = await this.userRepository.findByIdentity(identity)
      if (!user){
        throw new NotFoundException('User not found!')
      }
      return user;
    }catch(error: unknown){
      throw new NotFoundException('User not found!')
    }
    
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(options?: any): Promise<User[]> {
    return await this.userRepository.findAll(options);
  }

  async update(id: string, userData: Partial<User>): Promise<[number, User[]]> {
    return await this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<number> {
    return await this.userRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }

  async dashboard(data: IDashboardInput, userId: string): Promise<IDashboard> {
    try{
      const { deviceFCMToken, ipAddress, name } = data;

      const user = await this.userRepository.fetchUser(userId);
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
          userType: user.userType
        });
      } else{
        await this.clientDeviceService.updateDeviceToken(clientDevice.id, deviceFCMToken);
        // throw new UnauthorizedException("A new client device token was detected");
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

  async updateImageUrl(userId: string, imageUrl: string): Promise<User> {
    try {
      const user = await this.userRepository.fetchUser(userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const [affectedCount, updatedUsers] = await this.userRepository.update(userId, { imageUrl });
      if (affectedCount === 0) {
        throw new NotFoundException('User not found!');
      }

      const updatedUser = await this.userRepository.fetchUser(userId);
      if (!updatedUser) {
        throw new NotFoundException('User not found!');
      }

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to update image URL');
    }
  }
}
