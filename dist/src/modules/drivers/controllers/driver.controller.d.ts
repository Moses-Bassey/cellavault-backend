import { DriverService } from '../services/driver.service';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
import { DashboardDto } from 'src/modules/users/dto/user.dto';
import { UpdateBankAccountDto, ValidateBankAccountDto } from '../dto/kyc.dto';
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
    getBankAccountList(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<any>>;
    validateBankAccount(reqBody: ValidateBankAccountDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<any>>;
    createBankAccount(reqBody: UpdateBankAccountDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<UpdateBankAccountDto>>;
}
