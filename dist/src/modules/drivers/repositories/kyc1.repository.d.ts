import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';
export declare class Kyc1Repository {
    private kyc1Model;
    constructor(kyc1Model: typeof kyc1PersonalInfo);
    findById(id: string): Promise<kyc1PersonalInfo | null>;
    findByDriverId(driverId: string): Promise<kyc1PersonalInfo | null>;
    create(kycData: Partial<kyc1PersonalInfo>): Promise<kyc1PersonalInfo>;
    update(id: string, kycData: Partial<kyc1PersonalInfo>): Promise<[number, kyc1PersonalInfo[]]>;
    updateByDriverId(driverId: string, kycData: Partial<kyc1PersonalInfo>): Promise<[number, kyc1PersonalInfo[]]>;
    delete(id: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
}
