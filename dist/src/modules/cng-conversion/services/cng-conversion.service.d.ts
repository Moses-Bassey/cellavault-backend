import { CngConversion } from '../entities/cng-conversion.entity';
import { CngConversionRepository } from '../repositories/cng-conversion.repository';
import { CreateCngConversionDto } from '../dto/cng-conversion.dto';
import { ENGINE_CONDITION } from 'src/enums/engine-condition.enum';
import { FUEL_TYPE } from 'src/enums/fuel-type.enum';
import { TRANSMISSION } from 'src/enums/transmission.enum';
import { UserService } from 'src/modules/users/services/user.service';
import { UserType } from 'src/enums/user-type.enum';
export declare class CngConversionService {
    private readonly cngConversionRepository;
    private readonly userService;
    constructor(cngConversionRepository: CngConversionRepository, userService: UserService);
    fetchTransmission(): {
        transmissions: TRANSMISSION[];
        fuelTypes: FUEL_TYPE[];
        engine_condition: ENGINE_CONDITION[];
    };
    fetchUserCngConversions(userId: string, page: number, limit: number): Promise<{
        fetchTransmission: {
            transmissions: TRANSMISSION[];
            fuelTypes: FUEL_TYPE[];
            engine_condition: ENGINE_CONDITION[];
        };
        conversions: CngConversion[];
    }>;
    fetchUserCngConversionsStats(userId: string): Promise<{
        pending: number;
        completed: number;
    }>;
    findById(id: string): Promise<CngConversion | null>;
    findAll(): Promise<CngConversion[]>;
    create(userId: string, userType: UserType, cngConversionData: CreateCngConversionDto): Promise<CreateCngConversionDto>;
    update(id: string, cngConversionData: Partial<CngConversion>): Promise<[number, CngConversion[]]>;
}
