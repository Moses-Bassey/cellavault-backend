import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { DriverRepository } from '../repositories/driver.repository';
import { DashboardDto } from 'src/modules/users/dto/user.dto';
import {
  IDashboard,
  IDashboardInput,
} from 'src/shared/interfaces/dashbaord.interface';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import {
  AddDriverLicenseDto,
  UpdateBankAccountDto,
  ValidateBankAccountDto,
} from '../dto/kyc.dto';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly clientDeviceService: ClientDeviceService,
  ) {}

  async addDriverLicense(userId: string, reqBody: AddDriverLicenseDto) {
    try {
      const driver = await this.driverRepository.update(userId, {
        licenseImageUrl: reqBody.licenseImageUrl,
      });
      if (!driver) {
        throw new NotFoundException('Driver not found!');
      }
      return reqBody;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  async updateBankAccount(userId: string, reqBody: UpdateBankAccountDto) {
    try {
      const driver = await this.driverRepository.update(userId, {
        accountName: reqBody.accountName,
        accountNo: reqBody.accountNo,
        bankName: reqBody.bankName,
        bankCode: reqBody.bankCode,
      });

      if (!driver) {
        throw new NotFoundException('Driver not found!');
      }

      return reqBody;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  async setDriverType(userId: string, isPeppcruiseDriver: boolean) {
    const driver = await this.driverRepository.update(userId, {
      isPeppcruiseDriver,
    });
    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }
    return driver;
  }

  async dashboard(data: IDashboardInput, userId: string): Promise<IDashboard> {
    try {
      const { deviceFCMToken, ipAddress, name } = data;

      const user = await this.driverRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const clientDevice =
        await this.clientDeviceService.findByDriverIdAndDeviceToken(
          userId,
          deviceFCMToken,
        );
      if (clientDevice == null) {
        await this.clientDeviceService.registerDevice({
          driverId: userId,
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
      }

      const dashboardRes: IDashboard = {
        fullName: user.fullName,
        email: user.email,
        phoneNo: user.phoneNo,
        userId: user.id,
      };
      return dashboardRes;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  async fetchDriver(id: string): Promise<Driver | null> {
    const driver = await this.driverRepository.fetchDriver(id);
    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }
    return driver;
  }

  async findById(id: string): Promise<Driver | null> {
    return await this.driverRepository.findById(id);
  }

  async findByIdentity(identity: string): Promise<Driver | null> {
    return await this.driverRepository.findByIdentity(identity);
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await this.driverRepository.findByEmail(email);
  }

  async countActiveDrivers(): Promise<number | null> {
    const kycStatus = KYC_COMPLETED.ALL_COMPLETED;
    const drivers = await this.driverRepository.findActiveDrivers(kycStatus);
    return drivers?.length ?? null;
  }

  async findAll(options?: any): Promise<Driver[]> {
    return await this.driverRepository.findAll(options);
  }

  async update(
    id: string,
    driverData: Partial<Driver>,
  ): Promise<[number, Driver[]]> {
    return await this.driverRepository.update(id, driverData);
  }

  async delete(id: string): Promise<number> {
    return await this.driverRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    return await this.driverRepository.restore(id);
  }
}
