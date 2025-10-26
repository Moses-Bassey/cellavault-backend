import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    findById(id: string): Promise<Driver | null>;
    update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]>;
    dashboard(driverData: Partial<Driver>): Promise<void>;
    findAvailableDrivers(): Promise<Driver[]>;
    findNearby(latitude: number, longitude: number): Promise<Driver[]>;
}
