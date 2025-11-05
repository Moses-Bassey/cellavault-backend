import { State } from '../entities/state.entity';
export declare class StateRepository {
    private stateModel;
    constructor(stateModel: typeof State);
    findById(id: string): Promise<State | null>;
    findByCountryId(countryId: string): Promise<State[]>;
    findAll(options?: any): Promise<State[]>;
    create(stateData: Partial<State>): Promise<State>;
    update(id: string, stateData: Partial<State>): Promise<[number, State[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
