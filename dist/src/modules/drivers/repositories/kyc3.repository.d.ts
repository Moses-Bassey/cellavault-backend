import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';
export declare class Kyc3Repository {
    private kyc3Model;
    constructor(kyc3Model: typeof kyc3ResidentialInformation);
    findById(id: string): Promise<kyc3ResidentialInformation | null>;
    findByDriverId(driverId: string): Promise<kyc3ResidentialInformation | null>;
    create(kycData: Partial<kyc3ResidentialInformation>): Promise<kyc3ResidentialInformation>;
    update(id: string, kycData: Partial<kyc3ResidentialInformation>): Promise<[number, kyc3ResidentialInformation[]]>;
    updateByDriverId(driverId: string, kycData: Partial<kyc3ResidentialInformation>): Promise<[number, kyc3ResidentialInformation[]]>;
    delete(id: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
}
