import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    findById(id: string): Promise<Driver | null>;
    dashboard(driverData: Partial<Driver>): Promise<void>;
}
