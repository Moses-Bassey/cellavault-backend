import { Country } from '../entities/country.entity';
import { CountryRepository } from '../repositories/country.repository';
export declare class CountryService {
    private readonly countryRepository;
    constructor(countryRepository: CountryRepository);
    findById(id: string): Promise<Country | null>;
    findByName(name: string): Promise<Country | null>;
    findAll(options?: any): Promise<Country[]>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: string, countryData: Partial<Country>): Promise<[number, Country[]]>;
    delete(id: string): Promise<number>;
    restore(id: string): Promise<void>;
}
