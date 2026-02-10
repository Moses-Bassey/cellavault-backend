import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserService } from '../../users/services/user.service';
import { DriverService } from '../../drivers/services/driver.service';
// import { RideService } from '../../rides/services/ride.service';
// import { PaymentService } from '../../paymentService/services/paymant.service';
// import { PayoutService } from '../../payout/services/payout.service';
import { DashboardDataDto } from '../dto/dashboard-data.dto';
import { PasswordUtil } from '../../../utils/password.util';

@Injectable()
export class UserAdminService {
  private readonly logger = new Logger(UserAdminService.name);

  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly driverService: DriverService,
    // private readonly rideService: RideSerivce,
  ) {}

  async getUsersData() {
    const [
      totalRiders,
      activeRiders,
      bannedRiders,
      newRidersThisMonth,
      // ridersWithComplaints,
    ] = await Promise.all([
      this.userService.countAllUsers(),
      this.userService.countActiveUsers(),
      this.userService.countBannedUsers(),
      this.userService.getNewUsersForMonth(),
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

  async findAll(options: {
    search?: string;
    status?: boolean;
    limit: number;
    page: number;
  }) {
    const offset = (options.page - 1) * options.limit;
    const users = await this.userService.findAll({ ...options, offset });
    const filterOptions = {
      search: options.search,
      status: options.status,
    };
    const totalCount = await this.userService.countFiltered(filterOptions);

    return {
      users,
      pagination: {
        totalCount,
        page: options.page,
        limit: options.limit,
      },
    };
  }

  async findById(id: string) {
    const user = await this.userService.fetchUser(id);
    return user;
  }

  async disableUser(id: string, adminId: string, password: string) {
    const admin = await this.adminService.findById(adminId);
    const isMatch = await this.verifyAdminPassword(password, admin!.password);
    if (!isMatch) throw new UnauthorizedException('Unauthorized');
    const updated = await this.userService.update(id, {
      isDisabled: true,
      isActive: false,
    });
    if (!updated) throw new NotFoundException('User not found for update');
    return;
  }

  async verifyAdminPassword(password: string, adminPassword: string) {
    const isPasswordValid = await PasswordUtil.verifyPassword(
      password,
      adminPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
