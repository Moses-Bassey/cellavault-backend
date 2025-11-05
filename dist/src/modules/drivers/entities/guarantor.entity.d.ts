import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
export declare class Guarantor extends Model<Guarantor> {
    id: string;
    driverId: string;
    driver: Driver;
    fullName: string;
    phoneNo: string;
    email: string;
    identificationImageUrl: string;
    utilityBillImageUrl: string;
    policeClearanceImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
