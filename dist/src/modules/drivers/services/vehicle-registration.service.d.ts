import { VehicleRegistration } from '../entities/vehicle-registration.entity';
import { VehicleRegistrationRepository } from '../repositories/vehicle-registration.repository';
import { DriverService } from './driver.service';
import { CreateVehicleRegistrationDto } from '../dto/vehicle-registration.dto';
export declare class VehicleRegistrationService {
    private readonly vehicleRegistrationRepository;
    private readonly driverService;
    constructor(vehicleRegistrationRepository: VehicleRegistrationRepository, driverService: DriverService);
    findById(id: string): Promise<VehicleRegistration | null>;
    findByDriverId(driverId: string): Promise<VehicleRegistration[]>;
    create(driverId: string, vehicleRegistrationData: CreateVehicleRegistrationDto): Promise<CreateVehicleRegistrationDto>;
    update(id: string, vehicleRegistrationData: Partial<VehicleRegistration>): Promise<[number, VehicleRegistration[]]>;
    deleteVehicleRegistration(id: string, driverId: string): Promise<number>;
    deleteByDriverId(driverId: string): Promise<number>;
}
