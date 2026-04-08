import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Trip, TripStatus } from '../../trips/entities/trip.entity';
import { UserRepository } from '../repositories/user.repository';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import { DashboardDto } from '../dto/user.dto';
import { DriverService } from 'src/modules/drivers/services/driver.service';
import { TripRepository } from '../../trips/repositories/trip.repository';
import { PaymentRepository } from '../../payment/repositories/payment.repository';
import { CoinRepository } from '../../payment/repositories/coin.repository';
import {
  PassengerAccountDto,
  PassengerActivitySummaryDto,
  PassengerRideRowDto,
  CursorPageDto,
} from '../../../shared/dto/user.dto';
import {
  IDashboard,
  IDashboardInput,
} from 'src/shared/interfaces/dashbaord.interface';
import { PasswordUtil } from 'src/utils/password.util';
import { PAYMENT_TYPE } from 'src/enums/payment.enums';
import { decodeCursor } from '../../../utils/cursor.util';

function parseISODateOrUndefined(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return d;
}

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
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientDeviceService: ClientDeviceService,
    private readonly rides: TripRepository,
    private readonly payments: PaymentRepository,
    private readonly coins: CoinRepository,
    private readonly configService: ConfigService,
  ) {}

  private toAccountDto(p: User): PassengerAccountDto {
    return {
      id: p.id,
      fullName: p.fullName,
      email: p.email ?? null,
      phoneNumber: p.phoneNo ?? null,
      imageUrl: p.imageUrl ?? null,
      status:
        p.isEmailVerified && p.isPhoneVerified
          ? 'VERIFIED'
          : 'PENDING VERIFICATION',
      joinDate: p.createdAt.toISOString(),
      shortDescription: /* p.shortDescription ?? */ null,
    };
  }

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

  async update(id: string, userData: Partial<User>): Promise<number | null> {
    return await this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<number> {
    return await this.userRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }


  // ======================================= //

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

  // ========================== //

  async getPassengerAccount(passengerId: string): Promise<PassengerAccountDto> {
    const passenger = await this.userRepository.findById(passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');
    return this.toAccountDto(passenger);
  }

  async updatePassengerAccount(
    passengerId: string,
    patch: {
      fullName?: string;
      email?: string;
      phoneNo?: string;
      imageUrl?: string;
      shortDescription?: string;
    },
  ): Promise<PassengerAccountDto> {
    const passenger = await this.userRepository.findById(passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');

    // minimal validation
    if (patch.email && !patch.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    const updated = await this.userRepository.update(passengerId, {
      fullName: patch.fullName,
      email: patch.email,
      phoneNo: patch.phoneNo,
      imageUrl: patch.imageUrl,
    });
    if (!updated) throw new NotFoundException('Passenger not found');
    const user = await this.fetchUser(passengerId);
    if (!user) throw new NotFoundException('User not found');
    console.log('Update: ', updated, '\n', 'User: ', user);
    return this.toAccountDto(user);
  }

  async suspendPassenger(passengerId: string, body: { reason?: string }) {
    const passenger = await this.userRepository.findById(passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');
    if (passenger.isActive === false && passenger.isDisabled === true)
      return { ok: true };

    await this.userRepository.update(passengerId, {
      isDisabled: true,
      isActive: false,
    });

    return { ok: true };
  }

  async unsuspendPassenger(passengerId: string) {
    const passenger = await this.userRepository.findById(passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');
    if (passenger.isActive === true && passenger.isDisabled === false)
      return { ok: true };

    await this.userRepository.update(passengerId, {
      isDisabled: false,
      isActive: true,
    });

    return { ok: true };
  }

  async getPassengerActivitySummary(params: {
    passengerId: string;
    from?: string;
    to?: string;
  }): Promise<PassengerActivitySummaryDto> {
    const passenger = await this.userRepository.findById(params.passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');

    const from = parseISODateOrUndefined(params.from);
    const to = parseISODateOrUndefined(params.to);

    // Run in parallel (low latency)
    const [rideSummary, totalSpend, totalCoins] = await Promise.all([
      this.rides.getPassengerRideSummary(params.passengerId, from, to),
      this.payments.sumPassengerSpend(params.passengerId, from, to),
      this.coins.sumPassengerCoins(params.passengerId, from, to),
    ]);

    return {
      ...rideSummary,
      totalSpend,
      totalCoins,
      from: from?.toISOString(),
      to: to?.toISOString(),
    };
  }

  async listPassengerRides(params: {
    passengerId: string;
    from?: string;
    to?: string;
    status?: TripStatus;
    limit?: number;
    cursor?: string;
  }): Promise<CursorPageDto<PassengerRideRowDto>> {
    const passenger = await this.userRepository.findById(params.passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');

    const from = parseISODateOrUndefined(params.from);
    const to = parseISODateOrUndefined(params.to);
    const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);
    const cursor = decodeCursor(params.cursor);

    const { rows, nextCursor } = await this.rides.listPassengerRides({
      userId: params.passengerId,
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

  async getRideDetails(passengerId: string, rideId: string) {
    const ride = await this.rides.findPassengerRideById(passengerId, rideId);
    if (!ride) throw new NotFoundException('Ride not found for passenger');
    return ride; // map to a dedicated DTO if needed
  }
}
