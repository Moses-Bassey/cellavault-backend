import { Model } from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
export declare class Admin extends Model<Admin> {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: UserType;
    isVerified: boolean;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
