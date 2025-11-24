import { CngStation } from '../entities/cng-station.entity';
import { CngStationRepository } from '../repositories/cng-station.repository';
export declare class CngStationService {
    private readonly cngStationRepository;
    constructor(cngStationRepository: CngStationRepository);
    findAll(): Promise<CngStation[]>;
}
