import { Country } from '../entities/country.entity';
import { CountryService } from '../services/country.service';
import { StateService } from '../services/state.service';
export declare class CountryController {
    private readonly countryService;
    private readonly stateService;
    constructor(countryService: CountryService, stateService: StateService);
    findAll(): Promise<import("src/utils/response.utils").ApiResponse<Country[]>>;
    getStatesByCountry(countryId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").State[]>>;
    findById(id: string): Promise<Country | null>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: string, countryData: Partial<Country>): Promise<[number, Country[]]>;
    delete(id: string): Promise<number>;
}
