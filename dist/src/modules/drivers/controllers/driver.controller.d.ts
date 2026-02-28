import { DriverService } from '../services/driver.service';
import { GetDriversQueryDto, UpdateDriverDto } from '../dto/driver.dto';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    getSummary(): Promise<import("src/utils/response.utils").ApiResponse<import("../dto/driver.dto").DriverSummaryDto>>;
    listDrivers(query: GetDriversQueryDto): Promise<import("src/utils/response.utils").ApiResponse<{
        items: {
            id: string;
            fullName: string;
            email: string;
            phoneNo: string;
            imageUrl: string;
            vehicleName: string | null;
            vehiclePlate: string | null;
            status: import("../../../enums/driver-verification-status.enum").DRIVER_VERIFICATION_STATUS;
            kycStatus: import("../../../enums/kyc.enums").KYC_COMPLETED;
            totalTrips: number;
            earningsMinor: number;
            lastActiveAt: string | null;
        }[];
        nextCursor: string | null;
    }>>;
    getDriver(driverId: string): Promise<import("src/utils/response.utils").ApiResponse<import("../dto/driver.dto").DriverAccountDto>>;
    updateDriver(driverId: string, body: UpdateDriverDto): Promise<import("src/utils/response.utils").ApiResponse<import("../dto/driver.dto").DriverAccountDto>>;
    suspend(driverId: string, body: {
        reason?: string;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        ok: boolean;
    }>>;
    unsuspend(driverId: string): Promise<import("src/utils/response.utils").ApiResponse<{
        ok: boolean;
    }>>;
}
