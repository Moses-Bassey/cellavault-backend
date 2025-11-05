import { Model } from 'sequelize-typescript';
import { Country } from './country.entity';
export declare class State extends Model<State> {
    id: string;
    name: string;
    countryId: string;
    country: Country;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
