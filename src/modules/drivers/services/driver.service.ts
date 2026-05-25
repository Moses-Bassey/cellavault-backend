import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { DriverRepository } from '../repositories/driver.repository';
import { Trip } from '../../trips/entities/trip.entity';
import { TripStatus } from 'src/enums/ride-status.enum';
import { TripRepository } from '../../trips/repositories/trip.repository';
import { PeppcoinService } from '../../peppcoin/services/peppcoin.service';
import {
  DriverAccountDto,
  DriverListRowDto,
  DriverSummaryDto,
  UpdateDriverDto,
} from '../dto/driver.dto';
import {
  CursorPageDto,
  PassengerRideRowDto,
  PassengerActivitySummaryDto,
} from '../../../shared/dto/user.dto';
import { decodeCursor } from '../../../utils/cursor.util';
import { parseISODateOrUndefined } from '../../../utils/date.util';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';
import { DRIVER_VERIFICATION_STATUS } from 'src/enums/driver-verification-status.enum';
import { PasswordUtil } from '../../../utils/password.util';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly rides: TripRepository,
    private readonly coinService: PeppcoinService,
  ) {}

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
    const data = await this.driverRepository.getSummary();
    if (!data) throw new NotFoundException('Summary not found');
    return data;
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
    if (!driver) throw new NotFoundException('Driver not found');

    // console.log('Driver: ', driver);
    // console.log('Vehicle : ', vehicle);
    return this.toAccountDto(driver, vehicle);
  }

  async getDriverActivitySummary(params: {
    driverId: string;
    from?: string;
    to?: string;
  }): Promise<PassengerActivitySummaryDto> {
    const driver = await this.driverRepository.findById(params.driverId);
    if (!driver) throw new NotFoundException('Driver not found');

    const from = parseISODateOrUndefined(params.from);
    const to = parseISODateOrUndefined(params.to);

    // Run in parallel (low latency)
    const [rideSummary, totalSpend, totalCoins] = await Promise.all([
      this.rides.getUserRideSummary({
        driverId: params.driverId,
        from,
        to,
      }),
      this.rides.sumPassengerSpend(params.driverId, from, to),
      this.coinService.getLedgerBalance(params.driverId),
    ]);

    return {
      ...rideSummary,
      totalSpend,
      totalCoins,
      from: from?.toISOString(),
      to: to?.toISOString(),
    };
  }

  async listDriverRides(params: {
    driverId: string;
    from?: string;
    to?: string;
    status?: TripStatus;
    limit?: number;
    cursor?: string;
  }): Promise<CursorPageDto<PassengerRideRowDto>> {
    const driver = await this.driverRepository.findById(params.driverId);
    if (!driver) throw new NotFoundException('Driver not found');

    const from = parseISODateOrUndefined(params.from);
    const to = parseISODateOrUndefined(params.to);
    const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
    const cursor = decodeCursor(params.cursor);

    const { rows, nextCursor } = await this.rides.listUserRides({
      driverId: params.driverId,
      from,
      to,
      status: params.status,
      limit,
      cursor,
    });

    return {
      items: rows.map((r: Trip) => ({
        id: r.id,
        pickupLabel: r.pickupLocation,
        pickupAddress: r.pickupAddress,
        dropoffLabel: r.dropoffLocation,
        dropoffAddress: r.dropoffAddress, // run migration to normalize name
        status: r.status,
        createdAt: new Date(r.createdAt).toISOString(),
      })),
      nextCursor,
    };
  }

  async getRideDetails(driverId: string, rideId: string) {
    const ride = await this.rides.findDriverRideById(driverId, rideId);
    if (!ride) throw new NotFoundException('Ride not found for driver');
    return ride; // map to a dedicated DTO if needed
  }

  // async updateDriverAccount(
  //   driverId: string,
  //   patch: UpdateDriverDto,
  // ): Promise<DriverAccountDto> {
  //   if (patch.email && !patch.email.includes('@')) {
  //     throw new BadRequestException('Invalid email');
  //   }

  //   const updated = await this.driverRepository.updateById(
  //     driverId,
  //     patch as any,
  //   );
  //   console.log('Updated: ', updated);
  //   if (!updated) throw new NotFoundException('Driver not found');

  //   return {
  //     id: updated.id,
  //     fullName: updated.fullName,
  //     email: updated.email ?? null,
  //     phoneNo: updated.phoneNo ?? null,
  //     imageUrl: updated.profileImageUrl ?? null,
  //     vehicleName: (updated as any).vehicleName ?? null,
  //     vehiclePlate: (updated as any).vehiclePlate ?? null,
  //     status:
  //       updated.verificationStatus == DRIVER_VERIFICATION_STATUS.VERIFIED
  //         ? 'ACTIVE'
  //         : 'INACTIVE',
  //     kycStatus: updated.kycCompleted,
  //     joinDate: updated.createdAt.toISOString(),
  //     shortDescription: (updated as any).shortDescription ?? null,
  //   };
  // }

  // async suspendDriver(driverId: string, body: { reason?: string }) {
  //   const driver = await this.driverRepository.findById(driverId);
  //   if (!driver) throw new NotFoundException('Driver not found');

  //   if (
  //     driver.verificationStatus === DRIVER_VERIFICATION_STATUS.REJECTED ||
  //     driver.isDisabled === true
  //   )
  //     return { ok: true };

  //   const updated = await this.driverRepository.updateById(driverId, {
  //     isDisabled: true,
  //     isAvailable: false,
  //   });

  //   if (!updated) throw new NotFoundException('Driver not found');
  //   return { ok: true };
  // }

  // async unsuspendDriver(driverId: string) {
  //   const driver = await this.driverRepository.findById(driverId);
  //   if (!driver) throw new NotFoundException('Driver not found');

  //   if (driver.isDisabled === false) return { ok: true };

  //   const updated = await this.driverRepository.updateById(driverId, {
  //     isDisabled: false,
  //     isAvailable: true,
  //   });

  //   if (!updated) throw new NotFoundException('Driver not found');
  //   return { ok: true };
  // }

  async deleteDriverAccount(email: string, password: string): Promise<null> {
    try {
      // Step 1: Find user
      const driver = await this.driverRepository.findByEmail(email);
      if (!driver) {
        throw new NotFoundException('User not found');
      }

      // Step 2: Verify password
      const verifyPassword = await PasswordUtil.verifyPassword(password, driver.password);
      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Step 4: Update email to email-uuid
      const newEmail = `${driver.email}-${driver.id}`;
      const newPhoneNo = `${driver.phoneNo}-${driver.id}`;

      const updatedDriver = await this.driverRepository.updateById(driver.id, { email: newEmail, phoneNo: newPhoneNo });
      if (!updatedDriver) {
        throw new NotFoundException('Driver not found after deletion');
      }

      await this.driverRepository.delete(driver.id);

      return null;
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new NotFoundException('Failed to delete driver account');
    }
  }
}
