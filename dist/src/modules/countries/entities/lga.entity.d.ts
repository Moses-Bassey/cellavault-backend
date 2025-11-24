import { Model } from 'sequelize-typescript';
import { State } from './state.entity';
import { Country } from './country.entity';
export declare class LGA extends Model<LGA> {
    id: string;
    name: string;
    stateId: string;
    state: State;
    countryId: string;
    country: Country;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
