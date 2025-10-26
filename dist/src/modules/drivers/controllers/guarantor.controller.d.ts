import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorService } from '../services/guarantor.service';
export declare class GuarantorController {
    private readonly guarantorService;
    constructor(guarantorService: GuarantorService);
    create(driverId: string, guarantorData: Partial<Guarantor>): Promise<Guarantor>;
    findByDriverId(driverId: string): Promise<Guarantor[]>;
    findById(id: string): Promise<Guarantor | null>;
    update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]>;
    delete(id: string): Promise<number>;
    verify(id: string): Promise<[number, Guarantor[]]>;
}
