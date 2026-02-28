import { ApiProperty } from '@nestjs/swagger';
import { UnprocessableEntityException } from '@nestjs/common';
import { IsOptional, IsEnum, IsEmail, IsString } from 'class-validator';
import { KYC_COMPLETED } from '../../../enums/kyc.enums';
import { DRIVER_VERIFICATION_STATUS } from 'src/enums/driver-verification-status.enum';
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

export class GetDriversQueryDto {
  @ApiProperty({ description: 'Search parameter', example: 'john' })
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', example: true })
  @IsOptional()
  @IsEnum(DRIVER_VERIFICATION_STATUS)
  status?: DRIVER_VERIFICATION_STATUS;

  @ApiProperty({ description: 'Filter by kyc status', example: '' })
  @IsOptional()
  @IsEnum(KYC_COMPLETED)
  kycStatus?: KYC_COMPLETED;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  limit?: string | number;

  @ApiProperty({ description: 'Cursor for optimized pagination', example: '' })
  @IsOptional()
  cursor?: string;
}

export class UpdateDriverDto {
  @ApiProperty({ description: "Driver's fullname", example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: "Driver's email address",
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: "Driver's  phone number", example: '' })
  @IsString()
  @IsOptional()
  phoneNo?: string;

  @ApiProperty({ description: "Driver's profile image url", example: 10 })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({ description: "Name of driver's vehicle", example: '' })
  @IsString()
  @IsOptional()
  vehicleName?: string;

  @ApiProperty({ description: "Driver's vehicle plate number", example: '' })
  @IsString()
  @IsOptional()
  vehiclePlate?: string;

  @ApiProperty({ description: 'Short description of driver', example: '' })
  @IsString()
  @IsOptional()
  shortDescription?: string;
}
