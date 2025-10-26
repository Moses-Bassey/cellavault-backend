import { Model } from 'sequelize-typescript';
export declare class Country extends Model<Country> {
    id: string;
    name: string;
    phoneCode: string;
    flag: string;
    currency: string;
    phoneLength: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
