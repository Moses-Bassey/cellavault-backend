import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
export declare class VehicleRegistration extends Model<VehicleRegistration> {
    id: string;
    driverId: string;
    driver: Driver;
    vehicleRegisterationNo: string;
    brandOfVehicle: string;
    color: string;
    makeOfVehicle: string;
    vinNumber: string;
    registerationExpiryDate: Date;
    plateNumberUrl: string;
    plateNo: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
