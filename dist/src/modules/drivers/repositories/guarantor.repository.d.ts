import { Guarantor } from '../entities/guarantor.entity';
export declare class GuarantorRepository {
    private guarantorModel;
    constructor(guarantorModel: typeof Guarantor);
    findById(id: string): Promise<Guarantor | null>;
    findByDriverId(driverId: string): Promise<Guarantor[]>;
    countByDriverId(driverId: string): Promise<number>;
    create(guarantorData: Partial<Guarantor>): Promise<Guarantor>;
    update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]>;
    delete(id: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
    verify(id: string): Promise<[number, Guarantor[]]>;
}
