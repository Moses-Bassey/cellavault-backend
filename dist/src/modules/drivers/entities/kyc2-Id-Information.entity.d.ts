import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
export declare class kyc2IdInformation extends Model<kyc2IdInformation> {
    id: string;
    driverId: string;
    driver: Driver;
    identificationType: string;
    identificationNumber: string;
    identificationImageUrl: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
