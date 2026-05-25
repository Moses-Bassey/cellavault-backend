import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions, fn, col, literal } from 'sequelize';
import { Driver } from '../entities/driver.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Trip } from '../../trips/entities/trip.entity'; // adjust path if needed
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

type DriverStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'REJECTED';
type KycStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'PERSONAL_INFORMATION'
  | 'IDENTITY_INFORMATION'
  | 'RESIDENTIAL_INFORMATION'
  | 'ALL_COMPLETED'
  | 'NOT_COMPLETED';

// normalize driver and kyc status enums

@Injectable()
export class DriverRepository {
  constructor(
    @InjectModel(Driver) private readonly driverModel: typeof Driver,
    @InjectModel(Vehicle) private readonly vehicleModel: typeof Vehicle,
    @InjectModel(Trip) private readonly tripModel: typeof Trip,
  ) {}

  async getSummary(): Promise<{
    totalDrivers: number;
    activeDrivers: number;
    suspendedDrivers: number;
    pendingKycApprovals: number;
    driversWithPendingPayouts: number;
  }> {
    // One query with conditional counts (works on MySQL)
    const row = await this.driverModel.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'totalDrivers'],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN verificationStatus = 'VERIFIED' THEN 1 ELSE 0 END`,
            ),
          ),
          'activeDrivers',
        ],
        [
          fn('SUM', literal(`CASE WHEN isDisabled = true THEN 1 ELSE 0 END`)),
          'suspendedDrivers',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN kycCompleted != 'ALL_COMPLETED' THEN 1 ELSE 0 END`,
            ),
          ),
          'pendingKycApprovals',
        ],
        // Placeholder: replace with actual payout logic/table when available
        [literal('0'), 'driversWithPendingPayouts'],
      ],
      raw: true,
    });

    return {
      totalDrivers: Number(row?.['totalDrivers'] ?? 0),
      activeDrivers: Number(row?.['activeDrivers'] ?? 0),
      suspendedDrivers: Number(row?.['suspendedDrivers'] ?? 0),
      pendingKycApprovals: Number(row?.['pendingKycApprovals'] ?? 0),
      driversWithPendingPayouts: Number(
        row?.['driversWithPendingPayouts'] ?? 0,
      ),
    };
  }

  async findActiveDrivers(
    kycCompleted: KYC_COMPLETED,
  ): Promise<Driver[] | null> {
    return await this.driverModel.findAll({
      where: { kycCompleted },
    });
  }

  async findById(driverId: string) {
    const driver = await this.driverModel.findByPk(driverId, {
      attributes: { exclude: ['password'] },
    });

    return driver?.toJSON() ?? null;
  }

  async findByEmail(email: string): Promise<Driver | null> {
    const driver = await this.driverModel.findOne({
      where: { email },
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async updateById(driverId: string, patch: Partial<Driver>) {
    const [affected] = await this.driverModel.update(patch, {
      where: { id: driverId },
    });
    if (!affected) return null;
    return this.findById(driverId);
  }

  async delete(id: string): Promise<number> {
    return await this.driverModel.destroy({
      where: { id },
    });
  }

  async listDrivers(params: {
    search?: string;
    status?: DriverStatus;
    kycStatus?: KycStatus;
    limit: number;
    cursor?: { createdAt: Date; id: string };
  }): Promise<{ drivers: any[]; nextCursor: string | null }> {
    const { search, status, kycStatus, limit, cursor } = params;

    const q = search?.trim() ? `%${search.trim()}%` : undefined;

    const where: WhereOptions<Driver> = {
      ...(status ? { verificationStatus: status } : {}),
      ...(kycStatus ? { kycCompleted: kycStatus } : {}),
      ...(q
        ? {
            [Op.or]: [
              { fullName: { [Op.like]: q } },
              { email: { [Op.like]: q } },
              { phoneNo: { [Op.like]: q } },
            ],
          }
        : {}),

      ...(cursor
        ? {
            [Op.and]: [
              {
                [Op.or]: [
                  { createdAt: { [Op.lt]: cursor.createdAt } },
                  { createdAt: cursor.createdAt, id: { [Op.lt]: cursor.id } },
                ],
              },
            ],
          }
        : {}),
    };

    const rows = await this.driverModel.findAll({
      where,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      limit,
      attributes: [
        'id',
        'fullName',
        'email',
        'phoneNo',
        'profileImageUrl',
        'verificationStatus',
        'kycCompleted',
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

    return { drivers: rows, nextCursor };
  }

  /**
   * Fetch the latest vehicle for each driverId (by createdAt desc, id desc),
   * then map by driverId.
   *
   * This is 1 query, no N+1.
   * Note: This uses a "max createdAt per driver" approach.
   */
  async getLatestVehiclesForDrivers(
    driverIds: string[],
  ): Promise<
    Map<string, { plateNumber: string; brand: string; color: string } | null>
  > {
    const map = new Map<
      string,
      { plateNumber: string; brand: string; color: string } | null
    >();
    driverIds.forEach((id) => map.set(id, null));
    if (driverIds.length === 0) return map;

    // fetch vehicles ordered by driverId, createdAt desc, id desc,
    // then keep first per driverId in JS. This avoids complex window functions.
    const vehicles = await this.vehicleModel.findAll({
      where: { driverId: { [Op.in]: driverIds } },
      attributes: [
        'driverId',
        'plateNumber',
        'brand',
        'color',
        'createdAt',
        'id',
      ],
      order: [
        ['driverId', 'ASC'],
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      raw: true,
    });

    // Keep first record per driverId (latest due to ordering)
    for (const v of vehicles as any[]) {
      if (!map.get(v.driverId)) {
        map.set(v.driverId, {
          plateNumber: v.plateNumber,
          brand: v.brand,
          color: v.color,
        });
      }
    }

    return map;
  }

  async getLatestVehiclesForDriver(
    driverId: string,
  ): Promise<
    Map<string, { plateNumber: string; brand: string; color: string } | null>
  > {
    const map = new Map<
      string,
      { plateNumber: string; brand: string; color: string } | null
    >();
    map.set(driverId, null);
    if (!driverId) return map;

    // fetch vehicles ordered by driverId, createdAt desc, id desc,
    // then keep first per driverId in JS. This avoids complex window functions.
    const vehicles = await this.vehicleModel.findAll({
      where: { driverId },
      attributes: [
        'driverId',
        'plateNumber',
        'brand',
        'color',
        'createdAt',
        'id',
      ],
      order: [
        ['driverId', 'ASC'],
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      raw: true,
    });

    // Keep first record per driverId (latest due to ordering)
    for (const v of vehicles as any[]) {
      if (!map.get(v.driverId)) {
        map.set(v.driverId, {
          plateNumber: v.plateNumber,
          brand: v.brand,
          color: v.color,
        });
      }
    }

    return map;
  }

  async getTripAggregatesForDrivers(
    driverIds: string[],
  ): Promise<
    Map<
      string,
      { totalTrips: number; earningsMinor: number; lastActiveAt: Date | null }
    >
  > {
    if (driverIds.length === 0) return new Map();

    // Aggregate per driver in ONE query
    // - totalTrips: count trips
    // - earnings: sum estimatedFee for COMPLETED trips (convert DECIMAL to minor units in app layer is tricky)
    // We'll return earnings as "naira decimal" then convert in service. For testing, treat estimatedFee * 100 safely.
    const rows = await this.tripModel.findAll({
      where: { driverId: { [Op.in]: driverIds } },
      attributes: [
        'driverId',
        [fn('COUNT', col('id')), 'totalTrips'],
        [fn('MAX', col('updatedAt')), 'lastActiveAt'],
        [
          fn(
            'COALESCE',
            fn(
              'SUM',
              literal(
                `CASE WHEN status = 'COMPLETED' THEN estimatedFee ELSE 0 END`,
              ),
            ),
            0,
          ),
          'earningsNaira',
        ],
      ],
      group: ['driverId'],
      raw: true,
    });

    const map = new Map<
      string,
      { totalTrips: number; earningsMinor: number; lastActiveAt: Date | null }
    >();

    for (const r of rows as any[]) {
      const earningsNaira = Number(r.earningsNaira ?? 0); // may be string in MySQL
      map.set(r.driverId, {
        totalTrips: Number(r.totalTrips ?? 0),
        earningsMinor: Math.round(earningsNaira * 100), // convert to minor units
        lastActiveAt: r.lastActiveAt ? new Date(r.lastActiveAt) : null,
      });
    }

    return map;
  }
}
