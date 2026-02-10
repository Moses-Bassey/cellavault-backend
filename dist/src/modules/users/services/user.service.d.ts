import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { ClientDeviceService } from 'src/modules/client-devices/services/client-device.service';
import { IDashboard, IDashboardInput } from 'src/shared/interfaces/dashbaord.interface';
export declare class UserService {
    private readonly userRepository;
    private readonly clientDeviceService;
    private readonly configService;
    constructor(userRepository: UserRepository, clientDeviceService: ClientDeviceService, configService: ConfigService);
    fetchUser(id: string): Promise<User | null>;
    dashboard(data: IDashboardInput, userId: string): Promise<IDashboard>;
    findAll(options: {
        search?: string;
        status?: boolean;
        limit: number;
        offset: number;
    }): Promise<User[]>;
    countFiltered(options: {
        search?: string;
        status?: boolean;
    }): Promise<number>;
    update(id: string, userData: Partial<User>): Promise<[number, User[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
    countActiveUsers(): Promise<number | null>;
    countAllUsers(): Promise<number | null>;
    countBannedUsers(): Promise<number | null>;
    getNewUsersForMonth(): Promise<number>;
}
