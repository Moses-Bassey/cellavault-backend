import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn, literal, WhereOptions } from 'sequelize';
import { Trip, TripStatus, PaymentType } from '../entities/trip.entity';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';

@Injectable()
export class TripRepository {
  constructor(
    @InjectModel(Trip)
    private readonly tripModel: typeof Trip,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Driver) private readonly driverModel: typeof Driver,
  ) {}

  async create(data: Partial<Trip>): Promise<Trip> {
    return await this.tripModel.create(data as any);
  }

  async findById(id: string): Promise<Trip | null> {
    return await this.tripModel.findByPk(id, {
      include: ['user', 'driver'],
    });
  }

  async findUserActiveTrip(userId: string): Promise<Trip | null> {
    return await this.tripModel.findOne({
      where: {
        userId,
        status: {
          [Op.in]: [
            TripStatus.PENDING,
            TripStatus.ACCEPTED,
            TripStatus.ON_THE_WAY,
            TripStatus.ARRIVED,
          ],
        },
      },
      include: [
        {
          association: 'user',
          attributes: ['id', 'fullName', 'email', 'phoneNo', 'imageUrl'],
        },
        {
          association: 'driver',
          attributes: ['id', 'fullName', 'email', 'phoneNo', 'profileImageUrl'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
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

  async update(id: string, data: Partial<Trip>): Promise<[number, Trip[]]> {
    return await this.tripModel.update(data, {
      where: { id },
      returning: true,
    });
  }

  async updateStatus(id: string, status: TripStatus): Promise<Trip | null> {
    const [affectedCount] = await this.tripModel.update(
      { status },
      { where: { id } },
    );

    if (affectedCount > 0) {
      return await this.findById(id);
    }
    return null;
  }

  async delete(id: string): Promise<number> {
    return await this.tripModel.destroy({
      where: { id },
    });
  }

  // ============================== //

  async getPassengerRideSummary(userId: string, from?: Date, to?: Date) {
    const where: WhereOptions = { userId };
    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    // One query, conditional counts
    const row = await this.tripModel.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'totalRides'],
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END`),
          ),
          'completedRides',
        ],
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END`),
          ),
          'cancelledRides',
        ],
      ],
      where,
      raw: true,
    });

    return {
      totalRides: Number(row?.['totalRides'] ?? 0),
      completedRides: Number(row?.['completedRides'] ?? 0),
      cancelledRides: Number(row?.['cancelledRides'] ?? 0),
    };
  }

  async listPassengerRides(params: {
    userId: string;
    from?: Date;
    to?: Date;
    status?: TripStatus;
    limit: number;
    cursor?: { createdAt: Date; id: string }; // cursor for stable pagination
  }) {
    const { userId, from, to, status, limit, cursor } = params;

    const where: WhereOptions<Trip> = { userId };
    if (status) where['status'] = status;

    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    // Cursor: fetch records older than cursor (createdAt, id)
    if (cursor) {
      where[Op.or] = [
        { createdAt: { [Op.lt]: cursor.createdAt } },
        {
          createdAt: cursor.createdAt,
          id: { [Op.lt]: cursor.id },
        },
      ];
    }

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

    const last = rows[rows.length - 1];
    const nextCursor =
      rows.length === limit && last
        ? Buffer.from(
            JSON.stringify({ createdAt: last.createdAt, id: last.id }),
          ).toString('base64')
        : null;

    return { rows, nextCursor };
  }

  findPassengerRideById(passengerId: string, rideId: string) {
    return this.tripModel.findOne({
      where: { id: rideId, userId: passengerId },
    });
  }

  // ================= //

  async searchUserIds(search: string, limit = 500): Promise<string[]> {
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

  async searchDriverIds(search: string, limit = 500): Promise<string[]> {
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

  async getSummaryCounts(now = new Date(), from?: Date, to?: Date) {
    const where: WhereOptions<Trip> = {};
    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      } as any;
    }

    // Define “ongoing”
    // (tweak as you like)
    const ongoingStatuses = [
      TripStatus.ACCEPTED,
      TripStatus.ON_THE_WAY,
      TripStatus.ARRIVED,
    ];

    // Define “scheduled”
    // future startTime + not completed/cancelled
    const scheduledCond = literal(
      `(startTime IS NOT NULL AND startTime > NOW() AND status NOT IN ('COMPLETED','CANCELLED'))`,
    );

    const row = await this.tripModel.findOne({
      where,
      attributes: [
        [fn('COUNT', col('id')), 'totalTrips'],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN status IN ('${ongoingStatuses.join("','")}') THEN 1 ELSE 0 END`,
            ),
          ),
          'ongoingTrips',
        ],
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END`),
          ),
          'completedTrips',
        ],
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END`),
          ),
          'cancelledTrips',
        ],
        [
          fn(
            'SUM',
            literal(`CASE WHEN ${scheduledCond.val} THEN 1 ELSE 0 END`),
          ),
          'scheduledTrips',
        ],
      ],
      raw: true,
    });

    return {
      totalTrips: Number(row?.['totalTrips'] ?? 0),
      ongoingTrips: Number(row?.['ongoingTrips'] ?? 0),
      completedTrips: Number(row?.['completedTrips'] ?? 0),
      cancelledTrips: Number(row?.['cancelledTrips'] ?? 0),
      scheduledTrips: Number(row?.['scheduledTrips'] ?? 0),
    };
  }

  async listTrips(params: {
    from?: Date;
    to?: Date;
    status?: TripStatus;
    paymentType?: PaymentType;
    limit: number;
    cursor?: { createdAt: Date; id: string };

    // for DB-level search filtering
    tripId?: string;
    userIds?: string[];
    driverIds?: string[];
  }): Promise<{ trips: any[]; nextCursor: string | null }> {
    const {
      from,
      to,
      status,
      paymentType,
      limit,
      cursor,
      tripId,
      userIds,
      driverIds,
    } = params;

    const andConditions: any[] = [];

    // Date range
    if (from || to) {
      andConditions.push({
        createdAt: {
          ...(from ? { [Op.gte]: from } : {}),
          ...(to ? { [Op.lte]: to } : {}),
        },
      });
    }

    // Cursor pagination condition
    if (cursor) {
      andConditions.push({
        [Op.or]: [
          { createdAt: { [Op.lt]: cursor.createdAt } },
          { createdAt: cursor.createdAt, id: { [Op.lt]: cursor.id } },
        ],
      });
    }

    // Direct trip lookup (UUID)
    if (tripId) {
      andConditions.push({ id: tripId });
    }

    // Search by passenger/driver IDs (DB-level)
    // If both provided, OR them together (match either passenger or driver)
    if ((userIds && userIds.length) || (driverIds && driverIds.length)) {
      const or: any[] = [];
      if (userIds?.length) or.push({ userId: { [Op.in]: userIds } });
      if (driverIds?.length) or.push({ driverId: { [Op.in]: driverIds } });
      andConditions.push({ [Op.or]: or });
    }

    const where: WhereOptions<Trip> = {
      ...(status ? { status } : {}),
      ...(paymentType ? { paymentType } : {}),
      ...(andConditions.length ? { [Op.and]: andConditions } : {}),
    } as any;

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

    const last = rows[rows.length - 1];
    const nextCursor =
      rows.length === limit && last
        ? Buffer.from(
            JSON.stringify({ createdAt: last.createdAt, id: last.id }),
          ).toString('base64')
        : null;

    return { trips: rows, nextCursor };
  }

  async batchGetUsers(userIds: string[]) {
    if (userIds.length === 0) return [];
    return this.userModel.findAll({
      where: { id: { [Op.in]: Array.from(new Set(userIds)) } } as any,
      attributes: ['id', 'fullName', 'email', 'phoneNo', 'imageUrl'],
      raw: true,
    });
  }

  async batchGetDrivers(driverIds: string[]) {
    if (driverIds.length === 0) return [];
    return this.driverModel.findAll({
      where: { id: { [Op.in]: Array.from(new Set(driverIds)) } } as any,
      attributes: ['id', 'fullName', 'email', 'phoneNo', 'profileImageUrl'],
      raw: true,
    });
  }

  async findTripById(tripId: string) {
    return this.tripModel.findByPk(tripId);
  }
}
