import { Country } from '../entities/country.entity';
import { CountryService } from '../services/country.service';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    findAll(): Promise<import("../../../utils/response.utils").ApiResponse<null> | import("../../../utils/response.utils").ApiResponse<Country[]>>;
    findById(id: string): Promise<Country | null>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: string, countryData: Partial<Country>): Promise<[number, Country[]]>;
    delete(id: string): Promise<number>;
}
