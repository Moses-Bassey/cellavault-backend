import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
export declare class Guarantor extends Model<Guarantor> {
    id: string;
    driverId: string;
    driver: Driver;
    fullName: string;
    phoneNo: string;
    email: string;
    relationship: string;
    address: string;
    occupation: string;
    homeAddress: string;
    workAddress: string;
    identificationType: string;
    identificationNumber: string;
    additionalInfo: string;
    isVerified: boolean;
    verificationStatus: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
