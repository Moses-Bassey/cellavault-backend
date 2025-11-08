import { Model } from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
export declare class Passcode extends Model<Passcode> {
    id: string;
    userId: string;
    userType: UserType;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
