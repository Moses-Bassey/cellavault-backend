import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorRepository } from '../repositories/guarantor.repository';
export declare class GuarantorService {
    private readonly guarantorRepository;
    private readonly MAX_GUARANTORS;
    constructor(guarantorRepository: GuarantorRepository);
    findById(id: string): Promise<Guarantor | null>;
    findByDriverId(driverId: string): Promise<Guarantor[]>;
    countByDriverId(driverId: string): Promise<number>;
    create(driverId: string, guarantorData: Partial<Guarantor>): Promise<Guarantor>;
    update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]>;
    delete(id: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
    verify(id: string): Promise<[number, Guarantor[]]>;
    canAddMoreGuarantors(driverId: string): Promise<boolean>;
}
