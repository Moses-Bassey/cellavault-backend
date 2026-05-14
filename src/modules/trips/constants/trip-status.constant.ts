import { TripStatus } from 'src/enums/ride-status.enum';
import { TripFilterStatus } from 'src/enums/trip-filter-status.enum';

export const ACTIVE_TRIP_STATUSES = [
  TripStatus.TRIP_BOOKED,
  TripStatus.TRIP_ASSIGNED,
  TripStatus.DRIVER_ACCEPTED,
  TripStatus.DRIVER_ARRIVED,
  TripStatus.TRIP_STARTED,
  TripStatus.TRIP_RE_ASSIGN,
];

export const COMPLETED_TRIP_STATUSES = [
  TripStatus.TRIP_COMPLETED,
];

export const CANCELLED_TRIP_STATUSES = [
  TripStatus.TRIP_CANCELLED,
  TripStatus.TRIP_CANCELLED_BY_USER,
  TripStatus.TRIP_CANCELLED_BY_DRIVER,
  TripStatus.SYSTEM_CANCELLED,
];

export const TRIP_FILTER_STATUS_MAP: Record<
  TripFilterStatus,
  TripStatus[]
> = {
  [TripFilterStatus.ACTIVE]: ACTIVE_TRIP_STATUSES,

  [TripFilterStatus.COMPLETED]: COMPLETED_TRIP_STATUSES,

  [TripFilterStatus.CANCELLED]: CANCELLED_TRIP_STATUSES,
};