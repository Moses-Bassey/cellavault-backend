import { DriverRepository } from '../repositories/driver.repository';
import { DriverAccountDto, DriverSummaryDto } from '../dto/driver.dto';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';
export declare class DriverService {
    private readonly driverRepository;
    constructor(driverRepository: DriverRepository);
    private toAccountDto;
    getSummary(): Promise<DriverSummaryDto>;
    countActiveDrivers(): Promise<number | null>;
    listDrivers(params: {
        search?: string;
        status?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
        kycStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PERSONAL_INFORMATION' | 'IDENTITY_INFORMATION' | 'RESIDENTIAL_INFORMATION' | 'ALL_COMPLETED' | 'NOT_COMPLETED';
        limit?: number;
        cursor?: string;
    }): Promise<{
        items: {
            id: string;
            fullName: string;
            email: string;
            phoneNo: string;
            imageUrl: string;
            vehicleName: string | null;
            vehiclePlate: string | null;
            status: import("../../../enums/driver-verification-status.enum").DRIVER_VERIFICATION_STATUS;
            kycStatus: KYC_COMPLETED;
            totalTrips: number;
            earningsMinor: number;
            lastActiveAt: string | null;
        }[];
        nextCursor: string | null;
    }>;
    getDriverAccount(driverId: string): Promise<DriverAccountDto>;
    updateDriverAccount(driverId: string, patch: {
        fullName?: string;
        email?: string;
        phoneNo?: string;
        imageUrl?: string;
        vehicleName?: string;
        vehiclePlate?: string;
        shortDescription?: string;
    }): Promise<DriverAccountDto>;
    suspendDriver(driverId: string, body: {
        reason?: string;
    }): Promise<{
        ok: boolean;
    }>;
    unsuspendDriver(driverId: string): Promise<{
        ok: boolean;
    }>;
}
