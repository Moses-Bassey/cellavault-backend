import { State } from '../entities/state.entity';
import { StateRepository } from '../repositories/state.repository';
export declare class StateService {
    private readonly stateRepository;
    constructor(stateRepository: StateRepository);
    findById(id: string): Promise<State | null>;
    findByCountryId(countryId: string): Promise<State[]>;
    findAll(options?: any): Promise<State[]>;
    create(stateData: Partial<State>): Promise<State>;
    update(id: string, stateData: Partial<State>): Promise<[number, State[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
