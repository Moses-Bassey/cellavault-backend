import { AdminService } from './admin.service';
import { UserService } from '../../users/services/user.service';
import { DriverService } from '../../drivers/services/driver.service';
export declare class UserAdminService {
    private readonly userService;
    private readonly adminService;
    private readonly driverService;
    private readonly logger;
    constructor(userService: UserService, adminService: AdminService, driverService: DriverService);
    getUsersData(): Promise<{
        totalRiders: number | null;
        activeRiders: number | null;
        bannedRiders: number | null;
        newRidersThisMonth: number;
    }>;
    findAll(options: {
        search?: string;
        status?: boolean;
        limit: number;
        page: number;
    }): Promise<{
        users: import("../../users/entities").User[];
        pagination: {
            totalCount: number;
            page: number;
            limit: number;
        };
    }>;
    findById(id: string): Promise<import("../../users/entities").User | null>;
    disableUser(id: string, adminId: string, password: string): Promise<void>;
    verifyAdminPassword(password: string, adminPassword: string): Promise<boolean>;
}
