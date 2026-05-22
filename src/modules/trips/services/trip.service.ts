import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { Trip } from '../entities/trip.entity';
import { TripRepository } from '../repositories/trip.repository';
import {  TripShareService } from './trip-share.service';
import {
  CursorPageDto,
  TripDetailsDto,
  TripListRowDto,
  TripsSummaryDto,
} from '../dto/trip.dto';
import { TripAnalyticsPeriod } from '../../../enums/trip-analytics.enum';
import { PaymentType } from 'src/enums/trip-payment-type.enum';
import { TripStatus } from 'src/enums/ride-status.enum';
import { TripFilterStatus } from 'src/enums/trip-filter-status.enum';
import { TRIP_FILTER_STATUS_MAP } from '../constants/trip-status.constant';
import { decodeCursor } from '../../../utils/cursor.util';
import { calculateTripDistanceKm } from '../../../utils/trip-distance.util';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { RiderStats } from '../../../shared/interfaces/rider-stats.interface';

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
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly tripShareService: TripShareService,
    private readonly configService: ConfigService,
  ) {}

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
    status?: TripFilterStatus;
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

    // map frontend status to db statuses
    const statuses = params.status
      ? TRIP_FILTER_STATUS_MAP[params.status]
      : undefined;

    /* ---------- Fetch Trips (DB-level filtering) ---------- */

    const { trips, nextCursor } = await this.tripRepository.listTrips({
      from,
      to,
      statuses,
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
    const distanceCovered = calculateTripDistanceKm(
      trip.pickupLatitude,
      trip.pickupLongitude,
      trip.dropoffLatitude,
      trip.dropoffLongitude,
    );
    console.log('Distance from db: ', trip.distanceCovered);
    console.log('Distance from calculation: ', distanceCovered);


    return {
      id: trip.id,
      status: trip.status,
      paymentType: trip.paymentType ?? null,
      paymentStatus: trip.paymentStatus,
      estimatedFee: feeStr,
      createdAt: trip.createdAt.toISOString(),

      pickupAddress: trip.pickupAddress ?? null,
      dropoffAddress: trip.dropoffAddress ?? null,
      pickupLocation: trip.pickupLocation ?? null,
      dropoffLocation: trip.dropoffLocation ?? null,
      tripType: deriveTripType(trip),
      distanceCovered: trip.distanceCovered ?? distanceCovered,

      startTime: trip.startTime ? trip.startTime.toISOString() : null,
      arrivalTime: trip.driverArrivalTime ? trip.driverArrivalTime.toISOString() : null,
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

  /**
   * Public interface for ride stats. The UserService calls this; it never
   * touches the TripRepository directly, preserving module boundaries.
   */
  async getRideStatsByRiderIds(
    riderIds: string[],
  ): Promise<Map<string, RiderStats>> {
    return this.tripRepository.getStatsByRiderIds(riderIds);
  }

  // ====== For dashboard trip analytics ======== //
  async getTripAnalytics(period: TripAnalyticsPeriod): Promise<{
    totalTrips: number;
    trend: number;
    trendDirection: 'up' | 'down' | 'neutral';
    dataPoints: { label: string; count: number }[];
  }> {
    const now = moment();

    // ── Window boundaries & group function ────────────────────────────────────
    let currentStart: Date;
    let prevStart:    Date;
    let prevEnd:      Date;
    let groupFn:      'HOUR' | 'DAY' | 'DAYOFWEEK';

    switch (period) {
      case TripAnalyticsPeriod.YESTERDAY:
        currentStart = moment().subtract(1, 'day').startOf('day').toDate();
        prevStart = moment().subtract(2, 'day').startOf('day').toDate();
        prevEnd = moment().subtract(2, 'day').endOf('day').toDate();
        groupFn = 'HOUR';
        break;

      case TripAnalyticsPeriod.WEEK:
        currentStart = moment().startOf('isoWeek').toDate();
        prevStart = moment().subtract(1, 'week').startOf('isoWeek').toDate();
        prevEnd = moment().subtract(1, 'week').endOf('isoWeek').toDate();
        groupFn = 'DAYOFWEEK';
        break;

      case TripAnalyticsPeriod.MONTH:
        currentStart = moment().startOf('month').toDate();
        prevStart = moment().subtract(1, 'month').startOf('month').toDate();
        prevEnd = moment().subtract(1, 'month').endOf('month').toDate();
        groupFn = 'DAY';
        break;

      default: // 'today'
        currentStart = moment().startOf('day').toDate();
        prevStart = moment().subtract(1, 'day').startOf('day').toDate();
        prevEnd = moment().subtract(1, 'day').endOf('day').toDate();
        groupFn = 'HOUR';
    }

    // ── Parallel DB round-trip ────────────────────────────────────────────────
    const [rawBuckets, prevTotal] = await Promise.all([
      this.tripRepository.getTripCountByBucket(currentStart, now.toDate(), groupFn),
      this.tripRepository.countTripsInPeriod(prevStart, prevEnd),
    ]);
    // console.log('Query: ', rawBuckets, '\nqu: ', prevTotal);

    const currentTotal = rawBuckets.reduce((s, r) => s + r.count, 0);

    // ── Trend ─────────────────────────────────────────────────────────────────
    const trend =
      prevTotal > 0
        ? parseFloat(
            (((currentTotal - prevTotal) / prevTotal) * 100).toFixed(1),
          )
        : 0;

    const trendDirection =
      trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

    // ── Fill zero-padded buckets ──────────────────────────────────────────────
    const dataPoints = this.fillBuckets(rawBuckets, period, now);

    return { totalTrips: currentTotal, trend, trendDirection, dataPoints };
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private fillBuckets(
    raw: { bucket: number; count: number }[],
    period: TripAnalyticsPeriod,
    now: moment.Moment,
  ): { label: string; count: number }[] {
    const find = (bucket: number) =>
      raw.find((r) => r.bucket === bucket)?.count ?? 0;

    switch (period) {
      case TripAnalyticsPeriod.WEEK: {
        // MySQL DAYOFWEEK: 1 = Sun … 7 = Sat; display Mon → Sun
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((label, i) => {
          const mysqlDow = i === 6 ? 1 : i + 2; // Mon→2, …, Sat→7, Sun→1
          return { label, count: find(mysqlDow) };
        });
      }

      case TripAnalyticsPeriod.MONTH: {
        const days = now.daysInMonth();
        return Array.from({ length: days }, (_, i) => ({
          label: `${i + 1}`,
          count: find(i + 1), // MySQL DAY() is 1-indexed
        }));
      }

      default: { // today → 24 hourly buckets
        return Array.from({ length: 24 }, (_, h) => {
          const label =
            h === 0  ? '12 AM' :
            h < 12   ? `${h} AM` :
            h === 12 ? '12 PM' :
                      `${h - 12} PM`;
          return { label, count: find(h) };
        });
      }
    }
  }

  async generateShareLink(tripId: string) {
    const trip = await this.tripRepository.findById(tripId);

    if (!trip)
      throw new NotFoundException('Trip not found');

    const token = this.tripShareService.generateShareToken(trip.id);

    return {
      url: `${this.configService.get<string>('app.clientUrl')}/trips/${token}`,
    };
  }

  async getSharedTrip(token: string) {
    let payload: { tripId: string, type: string, v: number };

    try {
      payload =
        this.tripShareService.verifyShareToken(
          token,
        );
        console.log('Payload: ', payload);
      if (payload.type !== 'PUBLIC_SHARE')
        throw new BadRequestException(
          'Invalid share link',
        );
    } catch {
      throw new BadRequestException(
        'Invalid or expired share link',
      );
    }

    const trip =
      await this.tripRepository.findSharedTripById(payload.tripId);

    if (!trip) {
      throw new NotFoundException(
        'Trip not found',
      );
    }

    const distanceCovered = calculateTripDistanceKm(
      trip.pickupLatitude,
      trip.pickupLongitude,
      trip.dropoffLatitude,
      trip.dropoffLongitude,
    );
    return {
      // tripReference: trip.tripReference,

      pickupAddress: trip.pickupAddress,

      destinationAddress: trip.dropoffAddress,

      fare: trip.estimatedFee,

      distanceCovered: trip.distanceCovered ?? distanceCovered,

      status: trip.status,
      tripType: deriveTripType(trip),

      tripDate: trip.createdAt,

      // vehicleType: trip.vehicleType,

      driver: trip.driver
        ? {
            name: trip.driver.fullName,
            imageUrl: trip.driver.profileImageUrl,
            // vehicle:
            //   trip.driver.vehicleName,
          }
        : null,
    };
  }
}
