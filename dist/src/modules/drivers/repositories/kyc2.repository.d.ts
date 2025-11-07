import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';
export declare class Kyc2Repository {
    private kyc2Model;
    constructor(kyc2Model: typeof kyc2IdInformation);
    findById(id: string): Promise<kyc2IdInformation | null>;
    findByDriverId(driverId: string): Promise<kyc2IdInformation | null>;
    create(kycData: Partial<kyc2IdInformation>): Promise<kyc2IdInformation>;
    update(id: string, kycData: Partial<kyc2IdInformation>): Promise<[number, kyc2IdInformation[]]>;
    updateByDriverId(driverId: string, kycData: Partial<kyc2IdInformation>): Promise<[number, kyc2IdInformation[]]>;
    delete(id: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
}
