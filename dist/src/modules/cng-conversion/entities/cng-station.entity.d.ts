import { Model } from 'sequelize-typescript';
export declare class CngStation extends Model<CngStation> {
    id: string;
    name: string;
    state: string;
    country: string;
    longitude: number;
    latitude: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
