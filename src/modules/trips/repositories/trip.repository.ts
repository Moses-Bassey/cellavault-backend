import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn, literal, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Trip } from '../entities/trip.entity';
import { PaymentType } from 'src/enums/trip-payment-type.enum';
import { TripStatus } from 'src/enums/ride-status.enum';

import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';

import { RiderStats } from '../../../shared/interfaces/rider-stats.interface';

import {
  ONGOING_TRIP_STATUSES,
  COMPLETED_TRIP_STATUSES,
  CANCELLED_TRIP_STATUSES,
} from '../constants/trip-status.constant';

@Injectable()
export class TripRepository {
  constructor(
    @InjectModel(Trip)
    private readonly tripModel: typeof Trip,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Driver)
    private readonly driverModel: typeof Driver,

    private readonly sequelize: Sequelize,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                                  CONSTANTS                                 */
  /* -------------------------------------------------------------------------- */

  // private readonly ONGOING_TRIP_STATUSES = [
  //   TripStatus.TRIP_BOOKED,
  //   TripStatus.TRIP_ASSIGNED,
  //   TripStatus.DRIVER_ACCEPTED,
  //   TripStatus.DRIVER_ARRIVED,
  //   TripStatus.TRIP_STARTED,
  //   TripStatus.TRIP_RE_ASSIGN,
  // ];

  // private readonly COMPLETED_TRIP_STATUSES = [
  //   TripStatus.TRIP_COMPLETED,
  // ];

  // private readonly CANCELLED_TRIP_STATUSES = [
  //   TripStatus.TRIP_CANCELLED,
  //   TripStatus.TRIP_CANCELLED_BY_USER,
  //   TripStatus.TRIP_CANCELLED_BY_DRIVER,
  //   TripStatus.SYSTEM_CANCELLED,
  // ];

  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<Trip>): Promise<Trip> {
    return await this.tripModel.create(data as any);
  }

  async findById(id: string): Promise<Trip | null> {
    return await this.tripModel.findByPk(id, {
      include: ['user', 'driver'],
    });
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    userId?: string;
    driverId?: string;
    status?: TripStatus;
  }): Promise<Trip[]> {
    return await this.tripModel.findAll({
      where: {
        ...(options?.userId && { userId: options.userId }),
        ...(options?.driverId && { driverId: options.driverId }),
        ...(options?.status && { status: options.status }),
      },

      include: ['user', 'driver'],

      limit: options?.limit,

      offset: options?.offset,

      order: [['createdAt', 'DESC']],
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                            USER RIDE SUMMARY                               */
  /* -------------------------------------------------------------------------- */

  async getUserRideSummary({
    userId,
    driverId,
    from,
    to,
  }: {
    userId?: string;
    driverId?: string;
    from?: Date;
    to?: Date;
  }) {
    const where: WhereOptions = {
      ...(userId ? { userId } : driverId ? { driverId } : {}),
    };

    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    // console.log('================ USER RIDE SUMMARY ================');
    // console.log('WHERE =>', JSON.stringify(where, null, 2));

    // console.log(
    //   'COMPLETED STATUSES =>',
    //   this.COMPLETED_TRIP_STATUSES,
    // );

    // console.log(
    //   'CANCELLED STATUSES =>',
    //   this.CANCELLED_TRIP_STATUSES,
    // );

    const row = await this.tripModel.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'totalRides'],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN status IN (
                  '${COMPLETED_TRIP_STATUSES.join("','")}'
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'completedRides',
        ],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN status IN (
                  '${CANCELLED_TRIP_STATUSES.join("','")}'
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'cancelledRides',
        ],
      ],

      where,

      raw: true,
    });

    // console.log('SUMMARY RAW RESULT =>', row);

    return {
      totalRides: Number(row?.['totalRides'] ?? 0),

      completedRides: Number(row?.['completedRides'] ?? 0),

      cancelledRides: Number(row?.['cancelledRides'] ?? 0),
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              LIST USER RIDES                               */
  /* -------------------------------------------------------------------------- */

  async listUserRides(params: {
    userId?: string;
    driverId?: string;
    from?: Date;
    to?: Date;
    status?: TripStatus;
    limit: number;
    cursor?: { createdAt: Date; id: string };
  }) {
    const { userId, driverId, from, to, status, limit, cursor } =
      params;

    const where: WhereOptions<Trip> = {
      ...(userId ? { userId } : driverId ? { driverId } : {}),
    };

    if (status) {
      where['status'] = status;
    }

    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    if (cursor) {
      where[Op.or] = [
        { createdAt: { [Op.lt]: cursor.createdAt } },

        {
          createdAt: cursor.createdAt,
          id: { [Op.lt]: cursor.id },
        },
      ];
    }

    // console.log('================ LIST USER RIDES ================');
    // console.log('WHERE =>', JSON.stringify(where, null, 2));

    const rows = await this.tripModel.findAll({
      where,

      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],

      limit,

      attributes: [
        'id',
        'pickupLocation',
        'pickupAddress',
        'dropoffLocation',
        'dropoffAddress',
        'status',
        'createdAt',
      ],

      raw: true,
    });

    // console.log('RIDES FOUND =>', rows.length);

    const last = rows[rows.length - 1];

    const nextCursor =
      rows.length === limit && last
        ? Buffer.from(
            JSON.stringify({
              createdAt: last.createdAt,
              id: last.id,
            }),
          ).toString('base64')
        : null;

    // console.log('NEXT CURSOR =>', nextCursor);

    return {
      rows,
      nextCursor,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                             FIND RIDE BY ID                                */
  /* -------------------------------------------------------------------------- */

  findPassengerRideById(passengerId: string, rideId: string) {
    return this.tripModel.findOne({
      where: {
        id: rideId,
        userId: passengerId,
      },
    });
  }

  findDriverRideById(driverId: string, rideId: string) {
    return this.tripModel.findOne({
      where: {
        id: rideId,
        driverId,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                SEARCH USERS                                */
  /* -------------------------------------------------------------------------- */

  async searchUserIds(
    search: string,
    limit = 500,
  ): Promise<string[]> {
    const q = `%${search.trim()}%`;

    const rows = await this.userModel.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: q } },
          { email: { [Op.like]: q } },
          { phoneNo: { [Op.like]: q } },
        ],
      } as any,

      attributes: ['id'],

      limit,

      raw: true,
    });

    return (rows as any[]).map((r) => r.id);
  }

  async searchDriverIds(
    search: string,
    limit = 500,
  ): Promise<string[]> {
    const q = `%${search.trim()}%`;

    const rows = await this.driverModel.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: q } },
          { email: { [Op.like]: q } },
          { phoneNo: { [Op.like]: q } },
        ],
      } as any,

      attributes: ['id'],

      limit,

      raw: true,
    });

    return (rows as any[]).map((r) => r.id);
  }

  /* -------------------------------------------------------------------------- */
  /*                             SUMMARY COUNTS                                 */
  /* -------------------------------------------------------------------------- */

  async getSummaryCounts(
    now = new Date(),
    from?: Date,
    to?: Date,
  ) {
    const where: WhereOptions<Trip> = {};

    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      } as any;
    }

    // console.log('================ SUMMARY COUNTS ================');

    // console.log('WHERE =>', JSON.stringify(where, null, 2));

    // console.log(
    //   'ONGOING =>',
    //   this.ONGOING_TRIP_STATUSES,
    // );

    // console.log(
    //   'COMPLETED =>',
    //   this.COMPLETED_TRIP_STATUSES,
    // );

    // console.log(
    //   'CANCELLED =>',
    //   this.CANCELLED_TRIP_STATUSES,
    // );

    const row = await this.tripModel.findOne({
      where,

      attributes: [
        [fn('COUNT', col('id')), 'totalTrips'],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN status IN (
                  '${ONGOING_TRIP_STATUSES.join("','")}'
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'ongoingTrips',
        ],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN status IN (
                  '${COMPLETED_TRIP_STATUSES.join("','")}'
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'completedTrips',
        ],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN status IN (
                  '${CANCELLED_TRIP_STATUSES.join("','")}'
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'cancelledTrips',
        ],

        [
          fn(
            'SUM',
            literal(`
              CASE
                WHEN (
                  startTime IS NOT NULL
                  AND startTime > NOW()
                  AND status IN (
                    '${ONGOING_TRIP_STATUSES.join("','")}'
                  )
                )
                THEN 1
                ELSE 0
              END
            `),
          ),
          'scheduledTrips',
        ],
      ],

      raw: true,
    });

    // console.log('SUMMARY RESULT =>', row);

    return {
      totalTrips: Number(row?.['totalTrips'] ?? 0),

      ongoingTrips: Number(row?.['ongoingTrips'] ?? 0),

      completedTrips: Number(row?.['completedTrips'] ?? 0),

      cancelledTrips: Number(row?.['cancelledTrips'] ?? 0),

      scheduledTrips: Number(row?.['scheduledTrips'] ?? 0),
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                LIST TRIPS                                  */
  /* -------------------------------------------------------------------------- */

  async listTrips(params: {
    from?: Date;
    to?: Date;
    statuses?: TripStatus[];
    paymentType?: PaymentType;
    limit: number;
    cursor?: { createdAt: Date; id: string };
    tripId?: string;
    userIds?: string[];
    driverIds?: string[];
  }): Promise<{ trips: any[]; nextCursor: string | null }> {
    const {
      from,
      to,
      statuses,
      paymentType,
      limit,
      cursor,
      tripId,
      userIds,
      driverIds,
    } = params;

    const andConditions: any[] = [];

    if (from || to) {
      andConditions.push({
        createdAt: {
          ...(from ? { [Op.gte]: from } : {}),
          ...(to ? { [Op.lte]: to } : {}),
        },
      });
    }

    if (cursor) {
      andConditions.push({
        [Op.or]: [
          { createdAt: { [Op.lt]: cursor.createdAt } },

          {
            createdAt: cursor.createdAt,
            id: { [Op.lt]: cursor.id },
          },
        ],
      });
    }

    if (tripId) {
      andConditions.push({ id: tripId });
    }

    if ((userIds && userIds.length) || (driverIds && driverIds.length)) {
      const or: any[] = [];

      if (userIds?.length) {
        or.push({
          userId: {
            [Op.in]: userIds,
          },
        });
      }

      if (driverIds?.length) {
        or.push({
          driverId: {
            [Op.in]: driverIds,
          },
        });
      }

      andConditions.push({
        [Op.or]: or,
      });
    }

    const where: WhereOptions<Trip> = {
      ...(statuses?.length
        ? {
            status: {
              [Op.in]: statuses,
            },
          }
        : {}),

      ...(paymentType ? { paymentType } : {}),

      ...(andConditions.length
        ? {
            [Op.and]: andConditions,
          }
        : {}),
    } as any;

    // console.log('================ LIST TRIPS ================');

    // console.log('WHERE =>', JSON.stringify(where, null, 2));

    const rows = await this.tripModel.findAll({
      where,

      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],

      limit,

      attributes: [
        'id',
        'userId',
        'driverId',
        'status',
        'paymentType',
        'estimatedFee',
        'createdAt',
        'pickupLocation',
        'dropoffLocation',
      ],

      raw: true,
    });

    // console.log('TRIPS FOUND =>', rows.length);

    const last = rows[rows.length - 1];

    const nextCursor =
      rows.length === limit && last
        ? Buffer.from(
            JSON.stringify({
              createdAt: last.createdAt,
              id: last.id,
            }),
          ).toString('base64')
        : null;

    // console.log('NEXT CURSOR =>', nextCursor);

    return {
      trips: rows,
      nextCursor,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                             BATCH LOAD USERS                               */
  /* -------------------------------------------------------------------------- */

  async batchGetUsers(userIds: string[]) {
    if (userIds.length === 0) return [];

    return this.userModel.findAll({
      where: {
        id: {
          [Op.in]: Array.from(new Set(userIds)),
        },
      } as any,

      attributes: [
        'id',
        'fullName',
        'email',
        'phoneNo',
        'imageUrl',
      ],

      raw: true,
    });
  }

  async batchGetDrivers(driverIds: string[]) {
    if (driverIds.length === 0) return [];

    return this.driverModel.findAll({
      where: {
        id: {
          [Op.in]: Array.from(new Set(driverIds)),
        },
      } as any,

      attributes: [
        'id',
        'fullName',
        'email',
        'phoneNo',
        'profileImageUrl',
      ],

      raw: true,
    });
  }

  async findTripById(tripId: string) {
    return this.tripModel.findByPk(tripId);
  }

  /* -------------------------------------------------------------------------- */
  /*                           COUNT ONGOING TRIPS                              */
  /* -------------------------------------------------------------------------- */

  async countOngoingTrips(): Promise<number> {
    // console.log('================ COUNT ONGOING ================');

    // console.log(
    //   'ONGOING STATUSES =>',
    //   this.ONGOING_TRIP_STATUSES,
    // );

    const count = await this.tripModel.count({
      where: {
        status: {
          [Op.in]: ONGOING_TRIP_STATUSES,
        },
      },
    });

    // console.log('ONGOING COUNT =>', count);

    return count;
  }

  /* -------------------------------------------------------------------------- */
  /*                            RIDER STATS BATCH                               */
  /* -------------------------------------------------------------------------- */

  async getStatsByRiderIds(
    userIds: string[],
  ): Promise<Map<string, RiderStats>> {
    if (!userIds.length) {
      return new Map();
    }

    const rows = (await this.tripModel.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
      },

      attributes: [
        'userId',

        [
          this.sequelize.fn(
            'COUNT',
            this.sequelize.col('id'),
          ),
          'totalRides',
        ],

        [
          this.sequelize.fn(
            'MAX',
            this.sequelize.fn(
              'COALESCE',
              this.sequelize.col('completedAt'),
              this.sequelize.col('createdAt'),
            ),
          ),
          'lastRide',
        ],
      ],

      group: ['userId'],

      raw: true,
    })) as unknown as Array<{
      userId: string;
      totalRides: string;
      lastRide: string | null;
    }>;

    const statsMap = new Map<string, RiderStats>();

    for (const row of rows) {
      statsMap.set(row.userId, {
        totalRides: Number(row.totalRides),

        lastRide: row.lastRide
          ? new Date(row.lastRide)
          : null,
      });
    }

    return statsMap;
  }

  /* -------------------------------------------------------------------------- */
  /*                           SUM PASSENGER SPEND                              */
  /* -------------------------------------------------------------------------- */

  async sumPassengerSpend(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<number> {
    const where: WhereOptions = {
      userId,

      status: {
        [Op.in]: COMPLETED_TRIP_STATUSES,
      },
    };

    if (from || to) {
      where.completedAt = {};

      if (from) {
        where.completedAt[Op.gte] = from;
      }

      if (to) {
        where.completedAt[Op.lte] = to;
      }
    }

    // console.log('================ PASSENGER SPEND ================');

    // console.log('WHERE =>', JSON.stringify(where, null, 2));

    const total = await this.tripModel.sum('finalFee', {
      where,
    });

    // console.log('TOTAL SPEND =>', total);

    return Number(total || 0);
  }
}