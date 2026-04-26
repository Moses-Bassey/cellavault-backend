import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TripRepository } from '../repositories/trip.repository';
import {
  CursorPageDto,
  TripDetailsDto,
  TripListRowDto,
  TripsSummaryDto,
} from '../dto/trip.dto';
import { PaymentType, TripStatus, Trip } from '../entities/trip.entity';
import { decodeCursor } from '../../../utils/cursor.util';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';

/* -------------------------------- Utilities -------------------------------- */

function parseISODate(v?: string): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('Invalid date');
  }
  return d;
}

function feeToMinor(value: any): { feeStr: string; minor: number } {
  const feeStr = String(value ?? '0');
  const [naira, kobo = '00'] = feeStr.split('.');
  const minor = Number(naira) * 100 + Number((kobo + '00').slice(0, 2));
  return { feeStr, minor };
}

function deriveTripType(t: Trip): string {
  if (t.pickupLocation && t.dropoffLocation) return 'Intra-state';
  return 'UNKNOWN';
}

function isUuid(value?: string): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

/* -------------------------------- Service -------------------------------- */

@Injectable()
export class TripService {
  constructor(private readonly tripRepository: TripRepository) {}

  /* ========================= SUMMARY ========================= */

  async getSummary(params: {
    from?: string;
    to?: string;
    withDelta?: string;
  }): Promise<TripsSummaryDto> {
    const from = parseISODate(params.from);
    const to = parseISODate(params.to);

    const current = await this.tripRepository.getSummaryCounts(
      new Date(),
      from,
      to,
    );

    const withDelta = params.withDelta === 'true';
    if (!withDelta) return current;

    const yesterdayFrom = new Date();
    yesterdayFrom.setDate(yesterdayFrom.getDate() - 1);
    yesterdayFrom.setHours(0, 0, 0, 0);

    const yesterdayTo = new Date();
    yesterdayTo.setDate(yesterdayTo.getDate() - 1);
    yesterdayTo.setHours(23, 59, 59, 999);

    const prev = await this.tripRepository.getSummaryCounts(
      new Date(),
      yesterdayFrom,
      yesterdayTo,
    );

    const pct = (curr: number, prevv: number) =>
      prevv === 0
        ? curr > 0
          ? 100
          : 0
        : Math.round(((curr - prevv) / prevv) * 100);

    return {
      ...current,
      deltas: {
        totalTripsPct: pct(current.totalTrips, prev.totalTrips),
        ongoingTripsPct: pct(current.ongoingTrips, prev.ongoingTrips),
        completedTripsPct: pct(current.completedTrips, prev.completedTrips),
        cancelledTripsPct: pct(current.cancelledTrips, prev.cancelledTrips),
        scheduledTripsPct: pct(current.scheduledTrips, prev.scheduledTrips),
      },
    };
  }

  /* ========================= LIST TRIPS ========================= */

  async listTrips(params: {
    search?: string;
    status?: TripStatus;
    paymentType?: PaymentType;
    limit?: number;
    cursor?: string;
    from?: string;
    to?: string;
  }): Promise<CursorPageDto<TripListRowDto>> {
    const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 50);

    const cursor = decodeCursor(params.cursor);
    const from = parseISODate(params.from);
    const to = parseISODate(params.to);
    const search = params.search?.trim();

    let tripId: string | undefined;
    let userIds: string[] | undefined;
    let driverIds: string[] | undefined;

    /* ---------- SEARCH STRATEGY ---------- */

    if (search) {
      if (isUuid(search)) {
        // Direct trip lookup
        tripId = search;
      } else {
        // Search users and drivers in parallel
        const [foundUserIds, foundDriverIds] = await Promise.all([
          this.tripRepository.searchUserIds(search, 500),
          this.tripRepository.searchDriverIds(search, 500),
        ]);

        userIds = foundUserIds;
        driverIds = foundDriverIds;

        // If no matches found at all, short circuit
        if (
          (!userIds || userIds.length === 0) &&
          (!driverIds || driverIds.length === 0)
        ) {
          return { items: [], nextCursor: null };
        }
      }
    }

    /* ---------- Fetch Trips (DB-level filtering) ---------- */

    const { trips, nextCursor } = await this.tripRepository.listTrips({
      from,
      to,
      status: params.status,
      paymentType: params.paymentType,
      limit,
      cursor,
      tripId,
      userIds,
      driverIds,
    });

    if (!trips.length) {
      return { items: [], nextCursor };
    }

    /* ---------- Batch Load Related Entities ---------- */

    const passengerIds = trips.map((t) => t.userId);
    const driverIdsFromTrips = trips
      .filter((t) => t.driverId)
      .map((t) => t.driverId!) as string[];

    const [users, drivers] = await Promise.all([
      this.tripRepository.batchGetUsers(passengerIds),
      this.tripRepository.batchGetDrivers(driverIdsFromTrips),
    ]);

    const userMap = new Map<string, User>(users.map((u) => [u.id, u]));

    const driverMap = new Map<string, Driver>(drivers.map((d) => [d.id, d]));

    /* ---------- Map to DTO ---------- */

    const items: TripListRowDto[] = trips.map((t) => {
      const passenger = userMap.get(t.userId);
      const driver = t.driverId ? driverMap.get(t.driverId) : null;

      const { feeStr, minor } = feeToMinor((t as any).estimatedFee);

      return {
        id: t.id,
        passenger: {
          id: passenger?.id ?? t.userId,
          fullName: passenger?.fullName ?? 'Unknown',
          email: passenger?.email ?? null,
          imageUrl: passenger?.imageUrl ?? null,
        },
        driver: driver
          ? {
              id: driver.id,
              fullName: driver.fullName ?? 'Unknown',
              email: driver.email ?? null,
              imageUrl: driver.profileImageUrl ?? null,
            }
          : null,
        tripType: deriveTripType(t),
        status: t.status,
        paymentType: t.paymentType ?? null,
        fare: feeStr,
        fareMinor: minor,
        createdAt: t.createdAt.toISOString(),
      };
    });

    return { items, nextCursor };
  }

  /* ========================= TRIP DETAILS ========================= */

  async getTripDetails(tripId: string): Promise<TripDetailsDto> {
    const trip = await this.tripRepository.findTripById(tripId);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const [users, drivers] = await Promise.all([
      this.tripRepository.batchGetUsers([trip.userId]),
      trip.driverId
        ? this.tripRepository.batchGetDrivers([trip.driverId])
        : Promise.resolve([]),
    ]);

    const passenger = users[0];
    const driver = drivers[0];

    const { feeStr } = feeToMinor((trip as any).estimatedFee);

    return {
      id: trip.id,
      status: trip.status,
      paymentType: trip.paymentType ?? null,
      estimatedFee: feeStr,
      createdAt: trip.createdAt.toISOString(),

      pickupAddress: trip.pickupAddress ?? null,
      dropoffAddress: trip.dropoffAddress ?? null,
      pickupLocation: trip.pickupLocation ?? null,
      dropoffLocation: trip.dropoffLocation ?? null,

      startTime: trip.startTime ? trip.startTime.toISOString() : null,
      arrivalTime: trip.arrivalTime ? trip.arrivalTime.toISOString() : null,
      endTime: trip.endTime ? trip.endTime.toISOString() : null,

      passenger: {
        id: passenger?.id ?? trip.userId,
        fullName: passenger?.fullName ?? 'Unknown',
        email: passenger?.email ?? null,
        phoneNo: passenger?.phoneNo ?? null,
        imageUrl: passenger?.imageUrl ?? null,
      },

      driver: driver
        ? {
            id: driver.id,
            fullName: driver.fullName ?? 'Unknown',
            email: driver.email ?? null,
            phoneNo: driver.phoneNo ?? null,
            imageUrl: driver.profileImageUrl ?? null,
          }
        : null,
    };
  }

  async countOngoingTrips(): Promise<number> {
    return await this.tripRepository.countOngoingTrips();
  }
}
