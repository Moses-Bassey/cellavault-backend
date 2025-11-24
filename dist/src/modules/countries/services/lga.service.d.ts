import { LGA } from '../entities/lga.entity';
import { LgaRepository } from '../repositories/lga.repository';
export declare class LgaService {
    private readonly lgaRepository;
    constructor(lgaRepository: LgaRepository);
    findById(id: string): Promise<LGA | null>;
    findByStateId(stateId: string): Promise<LGA[]>;
    findAll(options?: any): Promise<LGA[]>;
    create(lgaData: Partial<LGA>): Promise<LGA>;
    update(id: string, lgaData: Partial<LGA>): Promise<[number, LGA[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
