import { StationBadge } from 'src/enums/station-badge.enum';

export type StationSource = 'CNG' | 'CNG_FUELING' | 'EV_CHARGING';

export class StationsSummaryDto {
  totalStations: number;
  activeStations: number;
  inactiveStations: number;
  cngStations: number; // CNG + CNG_FUELING (or only one, depending on your meaning)
  evChargingStations: number; // ChargingStation
}

export class StationListRowDto {
  id: string;
  source: StationSource; // tells frontend which table it came from

  name: string;
  stationType: string; // label for UI (e.g. "CNG Station", "EV Station")
  location: string; // "Abuja, Nigeria" from state/country or address fallback
  address: string;

  isActive: boolean;
  stationBadge: StationBadge;

  updatedAt: string; // ISO
}

export class CursorPageDto<T> {
  items: T[];
  nextCursor: string | null;
}

export class StationDetailsDto {
  id: string;
  source: StationSource;

  name: string;
  state?: string | null;
  country?: string | null;
  address: string;

  contactPhone: string;
  contactEmail: string;

  stationBadge: StationBadge;

  openingTime: string;
  closingTime: string;

  amountPerUnit: string; // DECIMAL -> string
  amountPerUnitType: string;
  currency: string;

  rating?: number | null;
  reviews?: number | null;

  latitude?: number | null;
  longitude?: number | null;
  stationImage?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
