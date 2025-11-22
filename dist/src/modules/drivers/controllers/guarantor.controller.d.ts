import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorService } from '../services/guarantor.service';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
import { CreateGuarantorDto } from '../dto/guarantor.dto';
export declare class GuarantorController {
    private readonly guarantorService;
    constructor(guarantorService: GuarantorService);
    create(driverId: string, guarantorData: CreateGuarantorDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<Guarantor>>;
    findByDriverId(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<Guarantor[]>>;
    deleteGuarantor(req: ExpressRequest & {
        user: JwtAuthPayload;
    }, id: string): Promise<import("src/utils/response.utils").ApiResponse<number>>;
}
