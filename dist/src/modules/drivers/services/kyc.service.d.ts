import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';
import { Kyc1Repository } from '../repositories/kyc1.repository';
import { Kyc2Repository } from '../repositories/kyc2.repository';
import { Kyc3Repository } from '../repositories/kyc3.repository';
import { CreateKyc1Dto, CreateKyc2Dto, CreateKyc3Dto } from '../dto/kyc.dto';
import { DriverRepository } from '../repositories';
import { CountryRepository } from 'src/modules/countries/repositories';
export declare class KycService {
    private readonly kyc1Repository;
    private readonly kyc2Repository;
    private readonly kyc3Repository;
    private readonly driverRepository;
    private readonly countryRepository;
    constructor(kyc1Repository: Kyc1Repository, kyc2Repository: Kyc2Repository, kyc3Repository: Kyc3Repository, driverRepository: DriverRepository, countryRepository: CountryRepository);
    createKyc1(driverId: string, kycData: CreateKyc1Dto): Promise<kyc1PersonalInfo | null>;
    fetchKyc1ByDriverId(driverId: string): Promise<kyc1PersonalInfo | null>;
    fetchKyc2ByDriverId(driverId: string): Promise<kyc2IdInformation | null>;
    fetchKyc3ByDriverId(driverId: string): Promise<kyc3ResidentialInformation | null>;
    createKyc2(driverId: string, kycData: CreateKyc2Dto): Promise<kyc2IdInformation | null>;
    createKyc3(driverId: string, kycData: CreateKyc3Dto): Promise<kyc3ResidentialInformation | null>;
    getAllKycByDriverId(driverId: string): Promise<{
        kyc1: kyc1PersonalInfo | null;
        kyc2: kyc2IdInformation | null;
        kyc3: kyc3ResidentialInformation | null;
    }>;
}
