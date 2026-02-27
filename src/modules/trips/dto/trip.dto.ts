// src/modules/trips/dto/admin-trip.dto.ts
import { PaymentType, TripStatus } from '../entities/trip.entity';

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
