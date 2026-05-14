import { TripStatus } from 'src/enums/ride-status.enum';

export class PassengerAccountDto {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  imageUrl: string | null;

  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING VERIFICATION' | 'VERIFIED';
  joinDate: string; // ISO

  shortDescription?: string | null;
}

export class PassengerActivitySummaryDto {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;

  totalSpend: number; // in minor units or major units depending on your system
  totalCoins: number;

  from?: string;
  to?: string;
}

export class PassengerRideRowDto {
  id: string;
  pickupLabel: string | undefined | null; // e.g."Mama's Cafe"
  pickupAddress: string | undefined | null; // e.g. "11 Owanon Crescent..."
  dropoffLabel: string | undefined | null;
  dropoffAddress: string | undefined | null;

  status: TripStatus;
  createdAt: string; // ISO
}

export class CursorPageDto<T> {
  items: T[];
  nextCursor: string | null;
}
