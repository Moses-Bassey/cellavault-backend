import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { AdminService } from '../../admins/services/admin.service';
import { UserService } from '../../users/services/user.service';
import { DriverService } from '../../drivers/services/driver.service';
import { TripService } from '../../trips/services/trip.service';
// import { PaymentService } from '../../paymentService/services/paymant.service';
// import { PayoutService } from '../../payout/services/payout.service';
import { DashboardDataDto } from '../dto/dashboard-data.dto';
import { PasswordUtil } from '../../../utils/password.util';
import { decodeCursor } from '../../../utils/cursor.util';
import { CursorPageDto } from '../../../shared/dto/user.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly userService: UserService,
    // private readonly adminService: AdminService,
    private readonly driverService: DriverService,
    private readonly tripService: TripService,
  ) {}

  async getDashboardData() {
    // : Promise<DashboardDataDto>
    const [
      ongoingTrips,
      activeDrivers,
      activeUsers,
      // pendingDisputes,
      // pendingPayouts,
      // revenueStats,
      // todayStats,
    ] = await Promise.all([
      this.tripService.countOngoingTrips(),
      this.driverService.countActiveDrivers(),
      this.userService.countActiveUsers(),
      // this.disputeService.countPending(),
      // this.payoutService.countPending(),
      // this.paymentService.getRevenueStats(),
      // this.rideService.getTodayStats(),
    ]);

    return {
      ongoingTrips,
      activeDrivers,
      activeUsers,
      // pendingDisputes,
      // pendingPayouts,
      // revenueStats,
      // todayStats,
    };
  }

  // async disableUser(id: string, adminId: string, password: string) {
  //   const admin = await this.adminService.findById(adminId);
  //   const isMatch = await this.verifyAdminPassword(password, admin!.password);
  //   if (!isMatch) throw new UnauthorizedException('Unauthorized');
  //   const updated = await this.userService.update(id, {
  //     isDisabled: true,
  //     isActive: false,
  //   });
  //   if (!updated) throw new NotFoundException('User not found for update');
  //   return;
  // }

  // async verifyAdminPassword(password: string, adminPassword: string) {
  //   const isPasswordValid = await PasswordUtil.verifyPassword(
  //     password,
  //     adminPassword,
  //   );

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   return true;
  // }
}
