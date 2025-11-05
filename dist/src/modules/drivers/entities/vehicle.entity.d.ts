import { Model } from 'sequelize-typescript';
import { Driver } from './driver.entity';
export declare class Vehicle extends Model<Vehicle> {
    id: string;
    driverId: string;
    driver: Driver;
    licenseNumber: string;
    registrationImageUrl: string;
    brand: string;
    color: string;
    plateNumber: string;
    imagePlateNumber: string;
    year: string;
    vinNumber: string;
    isPeppcruiseVehicle: boolean;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
