import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
import { State } from '../../countries/entities/state.entity';
export declare class kyc3ResidentialInformation extends Model<kyc3ResidentialInformation> {
    id: string;
    stateId: string;
    state: State;
    city: string;
    verified: boolean;
    driverId: string;
    driver: Driver;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
