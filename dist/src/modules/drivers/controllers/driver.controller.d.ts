import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    fetchDriver(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<Driver>>;
    dashboard(driverData: Partial<Driver>): Promise<void>;
}
