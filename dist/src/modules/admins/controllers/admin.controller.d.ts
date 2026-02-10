import { AdminService } from '../services/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardData(): Promise<import("src/utils/response.utils").ApiResponse<{
        activeDrivers: number | null;
        activeUsers: number | null;
    }>>;
    findById(id: string): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").Admin>>;
    findAll(limit?: number, offset?: number): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").Admin[]>>;
}
