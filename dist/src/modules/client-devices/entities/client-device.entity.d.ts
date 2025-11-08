import { Model } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
export declare class ClientDevice extends Model<ClientDevice> {
    id: string;
    ipAddress: string;
    deviceFCMToken: string | null;
    name: string | null;
    userId: string | null;
    driverId: string | null;
    userType: 'DRIVER' | 'USER' | null;
    user: User;
    driver: Driver;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
