import { VehicleRegistration } from '../entities/vehicle-registration.entity';
export declare class VehicleRegistrationRepository {
    private vehicleRegistrationModel;
    constructor(vehicleRegistrationModel: typeof VehicleRegistration);
    findById(id: string): Promise<VehicleRegistration | null>;
    findByDriverId(driverId: string): Promise<VehicleRegistration[]>;
    create(vehicleRegistrationData: Partial<VehicleRegistration>): Promise<VehicleRegistration>;
    update(id: string, vehicleRegistrationData: Partial<VehicleRegistration>): Promise<[number, VehicleRegistration[]]>;
    delete(id: string): Promise<number>;
    deleteVehicleRegistration(id: string, driverId: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
}
