import { Model } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
export declare class ClientDevice extends Model<ClientDevice> {
    id: string;
    ipAddress: string;
    deviceFCMToken: string | null;
    name: string | null;
    userId: string | null;
    userType: 'SUPER_ADMIN' | 'PEPP_ADMIN' | 'USER' | null;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
