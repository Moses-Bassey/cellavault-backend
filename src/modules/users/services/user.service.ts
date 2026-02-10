import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import { DashboardDto } from '../dto/user.dto';
import { DriverService } from 'src/modules/drivers/services/driver.service';
import {
  IDashboard,
  IDashboardInput,
} from 'src/shared/interfaces/dashbaord.interface';
import { PasswordUtil } from 'src/utils/password.util';
import { PAYMENT_TYPE } from 'src/enums/payment.enums';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientDeviceService: ClientDeviceService,
    private readonly configService: ConfigService,
  ) {}

  async fetchUser(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.fetchUser(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return user;
    } catch (error: unknown) {
      throw new NotFoundException('User not found!');
    }
  }

  async dashboard(data: IDashboardInput, userId: string): Promise<IDashboard> {
    try {
      const { deviceFCMToken, ipAddress, name } = data;

      const user = await this.userRepository.fetchUser(userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const clientDevice =
        await this.clientDeviceService.findByUserIdAndDeviceToken(
          userId,
          deviceFCMToken,
        );
      if (clientDevice == null) {
        await this.clientDeviceService.registerDevice({
          userId: userId,
          deviceFCMToken: deviceFCMToken,
          ipAddress: ipAddress,
          name: name,
          userType: user.userType,
        });
      } else {
        await this.clientDeviceService.updateDeviceToken(
          clientDevice.id,
          deviceFCMToken,
        );
        // throw new UnauthorizedException("A new client device token was detected");
      }

      const dashboardRes: IDashboard = {
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.phoneNo,
        userId: user.id,
        // paymentType: [PAYMENT_TYPE.CASH, PAYMENT_TYPE.PEPP_COIN, PAYMENT_TYPE.PI_COIN, PAYMENT_TYPE.WALLET]
      };

      return dashboardRes;
    } catch (error: unknown) {
      throw new NotFoundException('User not found!');
    }
  }

  async findAll(options: {
    search?: string;
    status?: boolean;
    limit: number;
    offset: number;
  }): Promise<User[]> {
    return await this.userRepository.findAll(options);
  }

  async countFiltered(options: {
    search?: string;
    status?: boolean;
  }): Promise<number> {
    return this.userRepository.countFiltered(options);
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

  async countActiveUsers(): Promise<number | null> {
    const isDisabled = false;
    const users = await this.userRepository.findActiveUsers(isDisabled);
    return users?.length ?? null;
  }

  async countAllUsers(): Promise<number | null> {
    const users = await this.userRepository.countAll();
    return users?.length ?? null;
  }

  async countBannedUsers(): Promise<number | null> {
    const isDisabled = true;
    const users = await this.userRepository.findAllBanned(isDisabled);
    return users?.length ?? null;
  }

  async getNewUsersForMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const currentMonthUsers = await this.userRepository.getNewUsersForMonth(
      currentYear,
      currentMonth,
    );

    return currentMonthUsers?.length ?? null;
  }
}
