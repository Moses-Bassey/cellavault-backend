import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col, literal } from 'sequelize';
import dayjs from 'dayjs';
import { Admin } from '../../admins/entities/admin.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { User } from '../../users/entities/user.entity';
import { ClientDevice } from '../../client-devices/entities/client-device.entity';

export interface AdminWithDevice {
  admin: Admin;
  device: ClientDevice | null;
}

export interface UserWithDevice {
  user: User;
  device: ClientDevice | null;
}

@Injectable()
export class ActivityRepository {
  /** Upper bound on riders returned per activity-monitor query. */
  private static readonly RIDERS_SAFETY_LIMIT = 500;
  constructor(
    @InjectModel(Admin) private readonly adminModel:  typeof Admin,
    @InjectModel(Driver) private readonly driverModel: typeof Driver,
    @InjectModel(User) private readonly userModel:   typeof User,
    @InjectModel(ClientDevice) private readonly deviceModel: typeof ClientDevice,
  ) {}

  // ─── Admins ──────────────────────────────────────────────────────────────

  /**
   * Fetch all admins + their most recent device in 2 parallel queries.
   * Admins are a small dataset (< 100) so no pagination needed here.
   */
  async findAdminsWithDevices(): Promise<AdminWithDevice[]> {
    const [admins, devices] = await Promise.all([
      this.adminModel.findAll({
        attributes: [
          "id", "fullName", "email", "role",
          "lastLogin", "isActive", "isVerified", "inviteStatus",
          "createdAt", "updatedAt",
        ],
        paranoid: true,
        order: [["lastLogin", "DESC"]],
      }),
      this.deviceModel.findAll({
        attributes: [
          "adminId", "ipAddress", "name",
          "deviceFCMToken", "createdAt", "updatedAt",
        ],
        where:   { adminId: { [Op.not]: null }, deletedAt: null },
        order:   [["updatedAt", "DESC"]],
        paranoid: false,
      }),
    ]);

    // Build latest-device-per-admin map (devices already sorted by updatedAt DESC)
    const deviceMap = new Map<string, ClientDevice>();
    for (const device of devices) {
      if (device.adminId && !deviceMap.has(device.adminId)) {
        deviceMap.set(device.adminId, device);
      }
    }

    return admins.map((admin) => ({
      admin,
      device: deviceMap.get(admin.id) ?? null,
    }));
  }

  /**
   * Batch count of device rows updated TODAY per admin ID.
   * Used as a proxy for "login count today" (one round trip, not N+1).
   */
  async getAdminDeviceActivityCountsToday(
    adminIds: string[],
  ): Promise<Map<string, number>> {
    if (!adminIds.length) return new Map();

    const todayStart = dayjs().startOf('day').toDate();

    const rows = (await this.deviceModel.findAll({
      attributes: [
        'adminId',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        adminId:   { [Op.in]: adminIds },
        updatedAt: { [Op.gte]: todayStart },
        deletedAt: null,
      },
      group:   ['adminId'],
      raw:     true,
      paranoid: false,
    })) as unknown as { adminId: string; count: string }[];

    return new Map(rows.map((r) => [r.adminId, parseInt(r.count, 10)]));
  }

  // ─── Drivers ─────────────────────────────────────────────────────────────

  /**
   * Minimal DB enrich for driver IDs coming from Redis.
   * Only fetches email (not in Redis) in a single IN query.
   */
  async findDriverEmailsById(
    ids: string[],
  ): Promise<Map<string, Pick<Driver, "id" | "email" | "createdAt">>> {
    if (!ids.length) return new Map();

    const drivers = await this.driverModel.findAll({
      attributes: ["id", "email", "createdAt"],
      where:      { id: { [Op.in]: ids }, deletedAt: null },
      paranoid:   false,
    });

    return new Map(drivers.map((d) => [d.id, d]));
  }

  // ─── Riders ──────────────────────────────────────────────────────────────

  /**
   * Fetch riders active since `since` (or all, if null).
   * updatedAt is used as the activity proxy — kept behind an index
   * so this query is efficient even on large user tables.
   *
   * Safety limit of 300 prevents runaway result sets for "all time".
   */
  async findRidersWithDevices(since: Date | null): Promise<UserWithDevice[]> {
    // Cursor pagination is applied by ActivityService on the combined
    // multi-entity result set AFTER this query returns. This limit exists
    // only to prevent runaway memory use on "all time" queries with large
    // rider tables. For today/week it is never hit in practice.
    const where: any = { deletedAt: null };
    if (since) where.updatedAt = { [Op.gte]: since };

    const users = await this.userModel.findAll({
        attributes: [
        "id", "fullName", "email", "phoneNo",
        "isActive", "isDisabled", "updatedAt", "createdAt",
        ],
        where,
        order:    [["updatedAt", "DESC"], ["id", "ASC"]], // ASC id for stable cursor tiebreak
        limit:    ActivityRepository.RIDERS_SAFETY_LIMIT,
        paranoid: false,
    });

    if (!users.length) return [];

    const userIds = users.map((u) => u.id);
    const devices = await this.deviceModel.findAll({
      attributes: ["userId", "ipAddress", "name", "deviceFCMToken", "updatedAt"],
      where:      { userId: { [Op.in]: userIds }, deletedAt: null },
      order:      [["updatedAt", "DESC"]],
      paranoid:   false,
    });

    // Latest device per user
    const deviceMap = new Map<string, ClientDevice>();
    for (const device of devices) {
      if (device.userId && !deviceMap.has(device.userId)) {
        deviceMap.set(device.userId, device);
      }
    }

    return users.map((user) => ({
      user,
      device: deviceMap.get(user.id) ?? null,
    }));
  }
}