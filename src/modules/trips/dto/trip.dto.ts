import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { PaymentType } from 'src/enums/trip-payment-type.enum';
import { TripStatus } from 'src/enums/ride-status.enum';
import { TripFilterStatus } from 'src/enums/trip-filter-status.enum';

export class TripsSummaryDto {
  totalTrips: number;
  ongoingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  scheduledTrips: number;

  // optional (for the green “+%” labels)
  deltas?: {
    totalTripsPct?: number;
    ongoingTripsPct?: number;
    completedTripsPct?: number;
    cancelledTripsPct?: number;
    scheduledTripsPct?: number;
  };
}

export class TripListRowDto {
  id: string;

  passenger: {
    id: string;
    fullName: string;
    email?: string | null;
    imageUrl?: string | null;
  };
  driver?: {
    id: string;
    fullName: string;
    email?: string | null;
    imageUrl?: string | null;
  } | null;

  tripType: string; // derived for now
  status: TripStatus;
  paymentType?: PaymentType | null;

  fare: string; // "25000.00"
  fareMinor: number; // 2500000 (optional but useful)
  createdAt: string; // ISO
}

export class CursorPageDto<T> {
  items: T[];
  nextCursor: string | null;
}

export class TripDetailsDto {
  id: string;
  status: TripStatus;
  paymentType?: PaymentType | null;
  estimatedFee: string;
  createdAt: string;

  pickupAddress?: string | null;
  dropoffAddress?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;

  startTime?: string | null;
  arrivalTime?: string | null;
  endTime?: string | null;

  passenger: {
    id: string;
    fullName: string;
    email?: string | null;
    phoneNo?: string | null;
    imageUrl?: string | null;
  };
  driver?: {
    id: string;
    fullName: string;
    email?: string | null;
    phoneNo?: string | null;
    imageUrl?: string | null;
  } | null;
}
export class GetTripsQueryDto {
  @ApiProperty({ description: 'Search parameter', example: 'Pepp cng station' })
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', example: 'COMPLETED' })
  @IsOptional()
  @IsEnum(TripFilterStatus)
  status?: TripFilterStatus;

  @ApiProperty({ description: 'Filter by station type', example: 'CNG' })
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  limit?: string | number;

  @ApiProperty({
    description: 'Cursor for optimized pagination',
    example: null,
  })
  @IsOptional()
  cursor?: string;

  @ApiProperty({
    description: 'Start date',
    example: null,
  })
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'End date',
    example: null,
  })
  @IsOptional()
  to?: string;

  @ApiProperty({
    description: '',
    example: null,
  })
  @IsOptional()
  withDelta?: string;
}
