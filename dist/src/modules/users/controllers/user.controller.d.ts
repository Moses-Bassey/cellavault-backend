import type { Request as ExpressRequest } from 'express';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { JwtAuthPayload } from '../../auth/auth.interface';
import { DashboardDto } from '../dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    fetchuser(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<User>>;
    dashboard(req: ExpressRequest & {
        user: JwtAuthPayload;
    }, userData: DashboardDto): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/interfaces/dashbaord.interface").IDashboard>>;
}
