import { CngStation } from '../entities/cng-station.entity';
export declare class CngStationRepository {
    private cngStationModel;
    constructor(cngStationModel: typeof CngStation);
    findAll(options?: any): Promise<CngStation[]>;
    create(cngStationData: Partial<CngStation>): Promise<CngStation>;
}
