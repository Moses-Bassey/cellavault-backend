import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorService } from '../services/guarantor.service';
export declare class GuarantorController {
    private readonly guarantorService;
    constructor(guarantorService: GuarantorService);
    create(driverId: string, guarantorData: Partial<Guarantor>): Promise<Guarantor>;
    findByDriverId(driverId: string): Promise<Guarantor[]>;
}
