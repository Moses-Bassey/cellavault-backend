import { Driver } from '../entities/driver.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';
type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
type KycStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'PERSONAL_INFORMATION' | 'IDENTITY_INFORMATION' | 'RESIDENTIAL_INFORMATION' | 'ALL_COMPLETED' | 'NOT_COMPLETED';
export declare class DriverRepository {
    private readonly driverModel;
    private readonly vehicleModel;
    private readonly tripModel;
    constructor(driverModel: typeof Driver, vehicleModel: typeof Vehicle, tripModel: typeof Trip);
    getSummary(): Promise<{
        totalDrivers: number;
        activeDrivers: number;
        suspendedDrivers: number;
        pendingKycApprovals: number;
        driversWithPendingPayouts: number;
    }>;
    findActiveDrivers(kycCompleted: KYC_COMPLETED): Promise<Driver[] | null>;
    findById(driverId: string): Promise<Driver | null>;
    updateById(driverId: string, patch: Partial<Driver>): Promise<Driver | null>;
    listDrivers(params: {
        search?: string;
        status?: DriverStatus;
        kycStatus?: KycStatus;
        limit: number;
        cursor?: {
            createdAt: Date;
            id: string;
        };
    }): Promise<{
        drivers: any[];
        nextCursor: string | null;
    }>;
    getLatestVehiclesForDrivers(driverIds: string[]): Promise<Map<string, {
        plateNumber: string;
        brand: string;
        color: string;
    } | null>>;
    getLatestVehiclesForDriver(driverId: string): Promise<Map<string, {
        plateNumber: string;
        brand: string;
        color: string;
    } | null>>;
    getTripAggregatesForDrivers(driverIds: string[]): Promise<Map<string, {
        totalTrips: number;
        earningsMinor: number;
        lastActiveAt: Date | null;
    }>>;
}
export {};
