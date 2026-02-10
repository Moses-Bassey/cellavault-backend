import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { Admin } from '../entities/admin.entity';
import { UserService } from '../../users/services/user.service';
import { DriverService } from '../../drivers/services/driver.service';
// import { RideService } from '../../rides/services/ride.service';
// import { PaymentService } from '../../paymentService/services/paymant.service';
// import { PayoutService } from '../../payout/services/payout.service';
import { DashboardDataDto } from '../dto/dashboard-data.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    // private readonly rideService: RideSerivce,
  ) {}

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      this.logger.warn(`Admin with id=${id} not found`);
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Admin[]> {
    const ratings = await this.adminRepository.findAll(options);
    this.logger.log(
      `Found ${ratings.length} ratings (filters: ${JSON.stringify(options)})`,
    );
    return ratings;
  }

  async update(id: string, data: Partial<Admin>): Promise<number | null> {
    const [affectedCount] = await this.adminRepository.update(id, data);
    console.log('Affected count: ', affectedCount);
    if (affectedCount == 0) {
      this.logger.warn(`Admin data not updated`);
      throw new BadRequestException('Failed to update');
    }
    this.logger.log(`Admin data updated`);
    return affectedCount;
  }

  async restore(id: string): Promise<void> {
    return await this.adminRepository.restore(id);
  }

  async getDashboardData() {
    // : Promise<DashboardDataDto>
    const [
      // ongoingTrips,
      activeDrivers,
      activeUsers,
      // pendingDisputes,
      // pendingPayouts,
      // revenueStats,
      // todayStats,
    ] = await Promise.all([
      // this.rideService.countOngoingTrips(),
      this.driverService.countActiveDrivers(),
      this.userService.countActiveUsers(),
      // this.disputeService.countPending(),
      // this.payoutService.countPending(),
      // this.paymentService.getRevenueStats(),
      // this.rideService.getTodayStats(),
    ]);

    return {
      // ongoingTrips,
      activeDrivers,
      activeUsers,
      // pendingDisputes,
      // pendingPayouts,
      // revenueStats,
      // todayStats,
    };
  }
}
