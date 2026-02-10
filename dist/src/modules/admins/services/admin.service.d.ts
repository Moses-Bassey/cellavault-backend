import { AdminRepository } from '../repositories/admin.repository';
import { Admin } from '../entities/admin.entity';
import { UserService } from '../../users/services/user.service';
import { DriverService } from '../../drivers/services/driver.service';
export declare class AdminService {
    private readonly adminRepository;
    private readonly userService;
    private readonly driverService;
    private readonly logger;
    constructor(adminRepository: AdminRepository, userService: UserService, driverService: DriverService);
    findById(id: string): Promise<Admin | null>;
    findAll(options?: {
        limit?: number;
        offset?: number;
    }): Promise<Admin[]>;
    update(id: string, data: Partial<Admin>): Promise<number | null>;
    restore(id: string): Promise<void>;
    getDashboardData(): Promise<{
        activeDrivers: number | null;
        activeUsers: number | null;
    }>;
}
