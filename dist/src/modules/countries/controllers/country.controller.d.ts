import { Country } from '../entities/country.entity';
import { CountryService } from '../services/country.service';
import { StateService } from '../services/state.service';
import { LgaService } from '../services/lga.service';
export declare class CountryController {
    private readonly countryService;
    private readonly stateService;
    private readonly lgaService;
    constructor(countryService: CountryService, stateService: StateService, lgaService: LgaService);
    findAll(): Promise<import("src/utils/response.utils").ApiResponse<Country[]>>;
    getStatesByCountry(countryId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").State[]>>;
    getLgasByState(stateId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").LGA[]>>;
    findById(id: string): Promise<Country | null>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: string, countryData: Partial<Country>): Promise<[number, Country[]]>;
    delete(id: string): Promise<number>;
}
