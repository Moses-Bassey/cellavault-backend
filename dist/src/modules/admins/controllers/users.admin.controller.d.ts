import { UserAdminService } from '../services/user.admin.service';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { GetUsersQueryDto } from '../dto/user.dto';
export declare class UserAdminController {
    private readonly userAdminService;
    constructor(userAdminService: UserAdminService);
    getUsersData(): Promise<import("src/utils/response.utils").ApiResponse<{
        totalRiders: number | null;
        activeRiders: number | null;
        bannedRiders: number | null;
        newRidersThisMonth: number;
    }>>;
    getAllUsers(query: GetUsersQueryDto): Promise<import("src/utils/response.utils").ApiResponse<{
        users: import("../../users/entities").User[];
        pagination: {
            totalCount: number;
            page: number;
            limit: number;
        };
    }>>;
    getUserById(id: string): Promise<import("src/utils/response.utils").ApiResponse<import("../../users/entities").User>>;
    suspendUser(id: string, password: string, req: AuthenticatedRequest): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
}
