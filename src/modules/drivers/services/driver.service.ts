// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { Driver } from '../entities/driver.entity';
// import { DriverRepository } from '../repositories/driver.repository';
// import { DashboardDto } from 'src/modules/users/dto/user.dto';
// import {
//   IDashboard,
//   IDashboardInput,
// } from 'src/shared/interfaces/dashbaord.interface';
// import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
// import {
//   AddDriverLicenseDto,
//   UpdateBankAccountDto,
//   ValidateBankAccountDto,
// } from '../dto/kyc.dto';
// import { KYC_COMPLETED } from 'src/enums/kyc.enums';

// @Injectable()
// export class DriverService {
//   constructor(
//     private readonly driverRepository: DriverRepository,
//     private readonly clientDeviceService: ClientDeviceService,
//   ) {}

//   async addDriverLicense(userId: string, reqBody: AddDriverLicenseDto) {
//     try {
//       const driver = await this.driverRepository.update(userId, {
//         licenseImageUrl: reqBody.licenseImageUrl,
//       });
//       if (!driver) {
//         throw new NotFoundException('Driver not found!');
//       }
//       return reqBody;
//     } catch (error: unknown) {
//       throw new BadRequestException(error);
//     }
//   }

//   async updateBankAccount(userId: string, reqBody: UpdateBankAccountDto) {
//     try {
//       const driver = await this.driverRepository.update(userId, {
//         accountName: reqBody.accountName,
//         accountNo: reqBody.accountNo,
//         bankName: reqBody.bankName,
//         bankCode: reqBody.bankCode,
//       });

//       if (!driver) {
//         throw new NotFoundException('Driver not found!');
//       }

//       return reqBody;
//     } catch (error: unknown) {
//       throw new BadRequestException(error);
//     }
//   }

//   async setDriverType(userId: string, isPeppcruiseDriver: boolean) {
//     const driver = await this.driverRepository.update(userId, {
//       isPeppcruiseDriver,
//     });
//     if (!driver) {
//       throw new NotFoundException('Driver not found!');
//     }
//     return driver;
//   }

//   async dashboard(data: IDashboardInput, userId: string): Promise<IDashboard> {
//     try {
//       const { deviceFCMToken, ipAddress, name } = data;

//       const user = await this.driverRepository.findById(userId);
//       if (!user) {
//         throw new NotFoundException('User not found!');
//       }

//       const clientDevice =
//         await this.clientDeviceService.findByDriverIdAndDeviceToken(
//           userId,
//           deviceFCMToken,
//         );
//       if (clientDevice == null) {
//         await this.clientDeviceService.registerDevice({
//           driverId: userId,
//           deviceFCMToken: deviceFCMToken,
//           ipAddress: ipAddress,
//           name: name,
//           userType: user.userType,
//         });
//       } else {
//         await this.clientDeviceService.updateDeviceToken(
//           clientDevice.id,
//           deviceFCMToken,
//         );
//       }

//       const dashboardRes: IDashboard = {
//         fullName: user.fullName,
//         email: user.email,
//         phoneNo: user.phoneNo,
//         userId: user.id,
//       };
//       return dashboardRes;
//     } catch (error: unknown) {
//       throw new BadRequestException(error);
//     }
//   }

//   async fetchDriver(id: string): Promise<Driver | null> {
//     const driver = await this.driverRepository.fetchDriver(id);
//     if (!driver) {
//       throw new NotFoundException('Driver not found!');
//     }
//     return driver;
//   }

//   async findById(id: string): Promise<Driver | null> {
//     return await this.driverRepository.findById(id);
//   }

//   async findByIdentity(identity: string): Promise<Driver | null> {
//     return await this.driverRepository.findByIdentity(identity);
//   }

//   async findByEmail(email: string): Promise<Driver | null> {
//     return await this.driverRepository.findByEmail(email);
//   }

//   async findAll(options?: any): Promise<Driver[]> {
//     return await this.driverRepository.findAll(options);
//   }

//   async update(
//     id: string,
//     driverData: Partial<Driver>,
//   ): Promise<[number, Driver[]]> {
//     return await this.driverRepository.update(id, driverData);
//   }

//   async delete(id: string): Promise<number> {
//     return await this.driverRepository.delete(id);
//   }

//   async restore(id: string): Promise<void> {
//     return await this.driverRepository.restore(id);
//   }
// }

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { DriverRepository } from '../repositories/driver.repository';
import {
  DriverAccountDto,
  DriverListRowDto,
  DriverSummaryDto,
} from '../dto/driver.dto';
import { CursorPageDto } from '../../../shared/dto/user.dto';
import { decodeCursor } from '../../../utils/cursor.util';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

// function decodeCursor(
//   cursor?: string,
// ): { createdAt: Date; id: string } | undefined {
//   if (!cursor) return undefined;
//   try {
//     const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
//     return { createdAt: new Date(decoded.createdAt), id: decoded.id };
//   } catch {
//     throw new BadRequestException('Invalid cursor');
//   }
// }

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  private toAccountDto(
    d: Driver,
    v?: { plateNumber: string; brand: string; color: string } | null,
  ): DriverAccountDto {
    return {
      id: d.id,
      fullName: d.fullName,
      email: d.email ?? null,
      phoneNo: d.phoneNo ?? null,
      imageUrl: d.profileImageUrl ?? null,
      vehicleName: v ? `${v.brand} ${v.color}` : null,
      vehiclePlate: v ? v.plateNumber : null,
      status:
        d.isEmailVerified &&
        d.isPhoneVerified &&
        !d.isDisabled &&
        !d.isSoftDeleted
          ? 'ACTIVE'
          : 'INACTIVE',
      kycStatus: d.kycCompleted,
      joinDate: d.createdAt.toISOString(),
      shortDescription: null,
    };
  }

  async getSummary(): Promise<DriverSummaryDto> {
    return this.driverRepository.getSummary();
  }

  async countActiveDrivers(): Promise<number | null> {
    const kycStatus = KYC_COMPLETED.ALL_COMPLETED;
    const drivers = await this.driverRepository.findActiveDrivers(kycStatus);
    return drivers?.length ?? null;
  }

  async listDrivers(params: {
    search?: string;
    status?:
      | 'ACTIVE'
      | 'SUSPENDED'
      | 'INACTIVE'
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'VERIFIED'
      | 'REJECTED';
    kycStatus?:
      | 'APPROVED'
      | 'PENDING'
      | 'REJECTED'
      | 'PERSONAL_INFORMATION'
      | 'IDENTITY_INFORMATION'
      | 'RESIDENTIAL_INFORMATION'
      | 'ALL_COMPLETED'
      | 'NOT_COMPLETED';
    limit?: number;
    cursor?: string;
  }) {
    const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
    const cursor = decodeCursor(params.cursor);

    const { drivers, nextCursor } = await this.driverRepository.listDrivers({
      search: params.search,
      status: params.status,
      kycStatus: params.kycStatus,
      limit,
      cursor,
    });

    const driverIds = drivers.map((d: Driver) => d.id);

    const [tripAgg, vehiclesMap] = await Promise.all([
      this.driverRepository.getTripAggregatesForDrivers(driverIds),
      this.driverRepository.getLatestVehiclesForDrivers(driverIds),
    ]);

    const items = drivers.map((d: Driver) => {
      const agg = tripAgg.get(d.id);
      const vehicle = vehiclesMap.get(d.id);

      return {
        id: d.id,
        fullName: d.fullName,
        email: d.email ?? null,
        phoneNo: d.phoneNo ?? null,
        imageUrl: d.profileImageUrl ?? null,

        // derived from Vehicle
        vehicleName: vehicle ? `${vehicle.brand} ${vehicle.color}` : null,
        vehiclePlate: vehicle ? vehicle.plateNumber : null,

        status: d.verificationStatus,
        kycStatus: d.kycCompleted,

        totalTrips: agg?.totalTrips ?? 0,
        earningsMinor: agg?.earningsMinor ?? 0,
        lastActiveAt: agg?.lastActiveAt ? agg.lastActiveAt.toISOString() : null,
      };
    });

    return { items, nextCursor };
  }

  async getDriverAccount(driverId: string): Promise<DriverAccountDto> {
    const [driver, vehicles] = await Promise.all([
      this.driverRepository.findById(driverId),
      this.driverRepository.getLatestVehiclesForDriver(driverId),
    ]);
    if (!driver) throw new NotFoundException('Driver not found');

    const vehicle = vehicles.get(driver.id);
    console.log('Vehicle', vehicle);
    if (!driver) throw new NotFoundException('Driver not found');

    return this.toAccountDto(driver, vehicle);
    // {
    //   id: driver.id,
    //   fullName: driver.fullName,
    //   email: driver.email ?? null,
    //   phoneNo: driver.phoneNo ?? null,
    //   imageUrl: driver.profileImageUrl ?? null,
    //   vehicleName: (driver as any).vehicleName ?? null,
    //   vehiclePlate: (driver as any).vehiclePlate ?? null,
    //   status: driver.verificationStatus, // use tenary oper.
    //   kycStatus: (driver as any).kycStatus,
    //   joinDate: driver.createdAt.toISOString(),
    //   shortDescription: (driver as any).shortDescription ?? null,
    // };
  }

  async updateDriverAccount(
    driverId: string,
    patch: {
      fullName?: string;
      email?: string;
      phoneNo?: string;
      imageUrl?: string;
      vehicleName?: string;
      vehiclePlate?: string;
      shortDescription?: string;
    },
  ): Promise<DriverAccountDto> {
    if (patch.email && !patch.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    const updated = await this.driverRepository.updateById(
      driverId,
      patch as any,
    );
    if (!updated) throw new NotFoundException('Driver not found');

    return {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email ?? null,
      phoneNo: (updated as any).phoneNo ?? null,
      imageUrl: (updated as any).imageUrl ?? null,
      vehicleName: (updated as any).vehicleName ?? null,
      vehiclePlate: (updated as any).vehiclePlate ?? null,
      status: (updated as any).status,
      kycStatus: (updated as any).kycStatus,
      joinDate: updated.createdAt.toISOString(),
      shortDescription: (updated as any).shortDescription ?? null,
    };
  }

  async suspendDriver(driverId: string, body: { reason?: string }) {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) throw new NotFoundException('Driver not found');

    if ((driver as any).status === 'SUSPENDED') return { ok: true };

    const updated = await this.driverRepository.updateById(driverId, {
      status: 'SUSPENDED',
      suspensionReason: body.reason?.slice(0, 500) ?? null,
      suspendedAt: new Date(),
    } as any);

    if (!updated) throw new NotFoundException('Driver not found');
    return { ok: true };
  }

  async unsuspendDriver(driverId: string) {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) throw new NotFoundException('Driver not found');

    if ((driver as any).status === 'ACTIVE') return { ok: true };

    const updated = await this.driverRepository.updateById(driverId, {
      status: 'ACTIVE',
      suspensionReason: null,
      suspendedAt: null,
    } as any);

    if (!updated) throw new NotFoundException('Driver not found');
    return { ok: true };
  }
}
