import { Model } from 'sequelize-typescript';
import { GENDER } from 'src/enums/gender.enum';
import { Driver } from './driver.entity';
export declare class kyc1PersonalInfo extends Model<kyc1PersonalInfo> {
    id: string;
    driverId: string;
    driver: Driver;
    fullName: string;
    phoneNo: string;
    email: string;
    gender: GENDER;
    dateOfBirth: Date;
    phoneBrand: string;
    phoneModel: string;
    isVerified: boolean;
    schoolCertificateImageUrl: string;
    utilityBillImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
