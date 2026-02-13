import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn, literal, WhereOptions } from 'sequelize';
import { Trip, TripStatus } from '../entities/trip.entity';

@Injectable()
export class TripRepository {
  constructor(
    @InjectModel(Trip)
    private readonly tripModel: typeof Trip,
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
}
