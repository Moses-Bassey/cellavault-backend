import { KYC_COMPLETED } from '../../../enums/kyc.enums';
export type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type KycStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export class DriverSummaryDto {
  totalDrivers: number;
  activeDrivers: number;
  suspendedDrivers: number;
  pendingKycApprovals: number;
  driversWithPendingPayouts: number;
}

export class DriverListRowDto {
  id: string;
  fullName: string;
  email: string | null;
  phoneNo: string | null;
  imageUrl: string | null;

  vehicleName: string | null;
  vehiclePlate: string | null;

  status: DriverStatus;
  kycStatus: KYC_COMPLETED;

  totalTrips: number;
  earningsMinor: number; // use kobo/cents; frontend formats to NGN
  lastActiveAt: string | null; // ISO
}

export class DriverAccountDto {
  id: string;
  fullName: string;
  email: string | null;
  phoneNo: string | null;
  imageUrl: string | null;

  vehicleName: string | null;
  vehiclePlate: string | null;

  status: DriverStatus;
  kycStatus: KYC_COMPLETED;

  joinDate: string; // ISO
  shortDescription?: string | null;
}
