import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findById(id: string): Promise<User | null>;
    update(id: string, userData: Partial<User>): Promise<[number, User[]]>;
    dashboard(userData: Partial<User>): Promise<void>;
}
