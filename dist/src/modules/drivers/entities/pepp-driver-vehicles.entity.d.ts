import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
export declare class PeppDriverVehicles extends Model<PeppDriverVehicles> {
    id: string;
    driverId: string;
    driver: Driver;
    vehicleId: string;
    vehicle: Vehicle;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
