import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorRepository } from '../repositories/guarantor.repository';
import { CountryService } from 'src/modules/countries/services/country.service';
import { DriverService } from './driver.service';
import { CreateGuarantorDto } from '../dto/guarantor.dto';
export declare class GuarantorService {
    private readonly guarantorRepository;
    private readonly countryService;
    private readonly driverService;
    private readonly MAX_GUARANTORS;
    constructor(guarantorRepository: GuarantorRepository, countryService: CountryService, driverService: DriverService);
    findById(id: string): Promise<Guarantor | null>;
    findByDriverId(driverId: string): Promise<Guarantor[]>;
    countByDriverId(driverId: string): Promise<number>;
    create(driverId: string, guarantorData: CreateGuarantorDto): Promise<Guarantor>;
    update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]>;
    deleteGuarantor(id: string, driverId: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
    canAddMoreGuarantors(driverId: string): Promise<boolean>;
}
