import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { TripStatus } from 'src/enums/ride-status.enum';
import { UserRepository } from '../repositories/user.repository';
import { TripRepository } from '../../trips/repositories/trip.repository';
import { TripService } from '../../trips/services/trip.service';
import { PeppcoinService } from '../../peppcoin/services/peppcoin.service';
import {
  PassengerAccountDto,
  PassengerActivitySummaryDto,
  PassengerRideRowDto,
  CursorPageDto,
} from '../../../shared/dto/user.dto';
import { deriveUserStatus } from '../../../utils/user-status.util';
import { UserListItemDto, UserListPageDto } from '../dto/user.dto';
import { UserStatusFilter } from '../../../enums/user-status.enum';
// import { PasswordUtil } from 'src/utils/password.util';
import { decodeCursor } from '../../../utils/cursor.util';
import { parseISODateOrUndefined } from '../../../utils/date.util';
import { PasswordUtil } from '../../../utils/password.util';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rides: TripRepository,
    private readonly tripsService: TripService,
    private readonly coinService: PeppcoinService,
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

  async findAll(params: {
    search?: string;
    status?: UserStatusFilter;
    limit?: number;
    cursor?: string;
  }): Promise<UserListPageDto> {
    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);

    const cursor = decodeCursor(params.cursor);
    const search = params.search?.trim();

    // ── 1. Paginated users ) ─────────────
    const { users, nextCursor } = await this.userRepository.findAll({
      search,
      status: params.status,
      limit,
      cursor,
    });

    // ── 2. Ride stats for this page's users (1 GROUP BY query) ───────────────
    const riderIds = users.map((u) => u.id);
    const statsMap = await this.tripsService.getRideStatsByRiderIds(riderIds);

    // ── 3. Merge + shape the response ─────────────────────────────────────────
    const items: UserListItemDto[] = users.map((user) => {
      const stats = statsMap.get(user.id);

      return {
        id: user.id,
        fullName: user.fullName,
        phoneNo: user.phoneNo,
        email: user.email,
        imageUrl: user.imageUrl ?? null,
        status: deriveUserStatus(user),
        totalRides: stats?.totalRides ?? 0,
        lastRide: stats?.lastRide?.toISOString() ?? null,
        joinDate: user.createdAt.toISOString(),
        complaints: 0, // TODO: wire in when ComplaintsModule is available
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return {
      items,
      nextCursor,
    };
  }

  async countFiltered(options: {
    search?: string;
    status?: boolean;
  }): Promise<number> {
    return this.userRepository.countFiltered(options);
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
      this.rides.getUserRideSummary({ userId: params.passengerId, from, to }),
      this.rides.sumPassengerSpend(params.passengerId, from, to),
      this.coinService.getLedgerBalance(params.passengerId),
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

    const { rows, nextCursor } = await this.rides.listUserRides({
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

  async getUsersData() {
    const [
      totalRiders,
      activeRiders,
      bannedRiders,
      newRidersThisMonth,
      // ridersWithComplaints,
    ] = await Promise.all([
      this.countAllUsers(),
      this.countActiveUsers(),
      this.countBannedUsers(),
      this.getNewUsersForMonth(),
      // this.complaintService.countUsersWithPendingComplaints(),
    ]);

    return {
      totalRiders,
      activeRiders,
      bannedRiders,
      newRidersThisMonth,
      // ridersWithComplaints,
    };
  }

  // async findById(id: string) {
  //   const user = await this.userService.fetchUser(id);
  //   return user;
  // }

  async deleteUserAccount(email: string, password: string): Promise<null> {
    try {
      // Step 1: Find user
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Step 2: Verify password
      const verifyPassword = await PasswordUtil.verifyPassword(password, user.password);
      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Step 4: Update email to email-uuid
      const newEmail = `${user.email}-${user.id}`;
      const newPhoneNo = `${user.phoneNo}-${user.id}`;

      const updatedDriver = await this.userRepository.update(user.id, { email: newEmail, phoneNo: newPhoneNo });
      if (!updatedDriver) {
        throw new NotFoundException('User not found after deletion');
      }

      await this.userRepository.delete(user.id);

      return null;
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new NotFoundException('Failed to delete driver account');
    }
  }
}
