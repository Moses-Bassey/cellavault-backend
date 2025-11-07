import { KycService } from '../services/kyc.service';
import { CreateKyc1Dto, CreateKyc2Dto, CreateKyc3Dto } from '../dto/kyc.dto';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { Request as ExpressRequest } from 'express';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    getAllKycByDriver(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        kyc1: import("../entities/kyc1-personal-Info.entity").kyc1PersonalInfo | null;
        kyc2: import("../entities/kyc2-Id-Information.entity").kyc2IdInformation | null;
        kyc3: import("../entities/kyc3-residential-Information.entity").kyc3ResidentialInformation | null;
    }>>;
    createKyc1(kycData: CreateKyc1Dto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc1-personal-Info.entity").kyc1PersonalInfo>>;
    getKyc1PersonalInfo(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc1-personal-Info.entity").kyc1PersonalInfo>>;
    createKyc2IdInformation(kycData: CreateKyc2Dto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc2-Id-Information.entity").kyc2IdInformation>>;
    getKyc2IdInformation(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc2-Id-Information.entity").kyc2IdInformation>>;
    createKyc3AddressInformation(kycData: CreateKyc3Dto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc3-residential-Information.entity").kyc3ResidentialInformation>>;
    getKyc3AddressInformation(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities/kyc3-residential-Information.entity").kyc3ResidentialInformation>>;
}
