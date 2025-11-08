import type { Request as ExpressRequest } from 'express';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { JwtAuthPayload } from '../../auth/auth.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    fetchuser(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<User>>;
    updateUser(userData: Partial<User>): Promise<void>;
    dashboard(userData: Partial<User>): Promise<void>;
}
