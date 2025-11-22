import { DriverService } from '../services/driver.service';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
import { DashboardDto } from 'src/modules/users/dto/user.dto';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    fetchDriver(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../entities").Driver>>;
    dashboard(reqBody: DashboardDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<import("../../../shared/interfaces/dashbaord.interface").IDashboard>>;
    setDriverType(reqBody: {
        isPeppcruiseDriver: boolean;
    }, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
}
