import { Injectable, Logger } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import dayjs from 'dayjs';

import { RedisService }       from '../../../services/redis/services/redis.service';
import { ActivityRepository } from '../repositories/activity.repository';
import { ClientDevice }       from '../../client-devices/entities/client-device.entity';
import { Admin }              from '../../admins/entities/admin.entity';
import { User }               from '../../users/entities/user.entity';
import { UserType }           from 'src/enums/user-type.enum';

import type {
  ActivityStatus,
  ActivityDevice,
  ActivityLogDto,
  ActivitySummaryDto,
  ActivityDataDto,
  GetActivityDto,
} from '../dto/activity.dto';
import {
  ActivityRoleGroup,
  ActivityStatusFilter,
  ActivityPeriod,
} from '../dto/activity.dto';
import { encodeActivityCursor, decodeActivityCursor } from '../utils/activity-cursor.util';

// ─── Status sort weights ──────────────────────────────────────────────────────
  
const STATUS_ORDER: Record<ActivityStatus, number> = {
  online: 0,
  idle:   1,
  offline: 2,
};

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly activityRepo: ActivityRepository,
    private readonly redisService: RedisService,
  ) {}
  
  // ─── Public API ───────────────────────────────────────────────────────────────

  async getActivityLog(dto: GetActivityDto): Promise<ActivityDataDto> {
    // this.logger.log('dto: ', dto);
    const {
      roleGroup = ActivityRoleGroup.ALL,
      status    = ActivityStatusFilter.ALL,
      period    = ActivityPeriod.TODAY,
      search,
      cursor,
      limit     = 10,
    } = dto  ;
    // this.logger.log(
    //   `[ACTIVITY LOG] period=${dto.period} limit=${dto.limit} cursor=${dto.cursor}`
    // );
  
    const since = this.periodToDate(period) ;
  
    const fetchAdmin  = roleGroup === ActivityRoleGroup.ALL || roleGroup === ActivityRoleGroup.ADMIN;
    const fetchDriver = roleGroup === ActivityRoleGroup.ALL || roleGroup === ActivityRoleGroup.DRIVER;
    const fetchRider  = roleGroup === ActivityRoleGroup.ALL || roleGroup === ActivityRoleGroup.RIDER;
  
    const [adminEntries, driverEntries, riderEntries] = await Promise.all([
      fetchAdmin  ? this.buildAdminEntries()      : Promise.resolve([]),
      fetchDriver ? this.buildDriverEntries()       : Promise.resolve([]),
      fetchRider  ? this.buildRiderEntries(since) : Promise.resolve([]),
    ]);
  
    let all: ActivityLogDto[] = [
      ...adminEntries,
      ...driverEntries,
      ...riderEntries,
    ];
  
    // ── Filters ─────────────────────────────────────────────────────────────
    if (status !== ActivityStatusFilter.ALL) {  
      all = all.filter((e) => e.status === status);
    }

    if (search?.trim()) {
      const q = search.trim().toLowerCase();
      all = all.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)    ||
          e.location.toLowerCase().includes(q),
      );
    }

    // ── Deterministic sort: status bucket → lastActiveAt DESC → id ASC ──────
    // The id tiebreaker makes the cursor stable when two items share a timestamp.
    all.sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (byStatus !== 0) return byStatus;

      const byTime = dayjs(b.lastActiveAt).diff(dayjs(a.lastActiveAt));
      if (byTime !== 0) return byTime;

      return a.id < b.id ? -1 : 1; // stable tiebreaker
    });

    // ── Summary computed from the full filtered set (before cursor slicing) ──
    const summary = this.computeSummary(all);
    const total   = all.length;

    // ── Cursor decode → find start index ────────────────────────────────────
    let startIndex = 0;
    if (cursor) {
      try {
        const id = decodeActivityCursor(cursor)?.id;

        if (id) {
          const idx = all.findIndex((item) => item.id === id);

          // idx = -1 means the cursor item was evicted (status changed, filter
          // no longer matches, etc.) — fall back to the beginning gracefully.
          if (idx !== -1) {
              startIndex = idx + 1;
          }
        }
      } catch {
        this.logger.warn("[getActivityLog] Received an invalid or expired cursor — starting from page 1.");
        startIndex = 0;
      }
    }

    // ── Slice the page ───────────────────────────────────────────────────────
    const items   = all.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < total;

    // ── Encode next cursor from the LAST item on this page ──────────────────
    const nextCursor: string | null =
      hasMore && items.length > 0
        ? encodeActivityCursor({
            id: items[items.length - 1].id,
            lastActiveAt: items[items.length - 1].lastActiveAt,
            statusOrder: STATUS_ORDER[items[items.length - 1].status],
         })
        : null;

    return { items, total, nextCursor, summary };
  }

  /**
   * Lightweight summary endpoint — powers KPI cards without table data.
   * Reuses the full log logic but only exposes the summary object.
   */
  async getActivitySummary(): Promise<ActivitySummaryDto> {
    const { summary } = await this.getActivityLog({
      roleGroup: ActivityRoleGroup.ALL,
      period:    ActivityPeriod.TODAY,
      limit:     1000, // large enough to capture all
    });
    return summary;
  }

  // ─── Private builders ─────────────────────────────────────────────────────

  private async buildAdminEntries(): Promise<ActivityLogDto[]> {
    const adminData = await this.activityRepo.findAdminsWithDevices();
    if (!adminData.length) return [];

    const adminIds = adminData.map((d) => d.admin.id);

    const [redisStatuses, loginCounts] = await Promise.all([
        this.redisService.batchGetAdminActivity(adminIds),
        this.activityRepo.getAdminDeviceActivityCountsToday(adminIds),
    ]);

    return adminData.map(({ admin, device }) => {
        const redis        = redisStatuses.get(admin.id);
        const status       = redis?.status ?? this.deriveAdminStatusFromDB(admin);
        const lastActiveAt = redis?.lastSeenAt
        ? redis.lastSeenAt.toISOString()
        : admin.updatedAt.toISOString();

        return this.buildDto({
        id:             admin.id,
        fullName:       admin.fullName,
        email:          admin.email,
        role:           admin.role as string,  // raw UserType — e.g. "SUPER_ADMIN"
        status,
        lastLoginAt:    admin.lastLogin?.toISOString() ?? null,
        lastActiveAt,
        device,
        loginCountToday: loginCounts.get(admin.id) ??
            (admin.lastLogin && dayjs(admin.lastLogin).isAfter(dayjs().startOf("day")) ? 1 : 0),
        });
    });
  }

  private async buildDriverEntries(): Promise<ActivityLogDto[]> {
    const { drivers: redisDrivers } = await this.redisService.getAllDriversForMap();
    if (!redisDrivers.length) return [];

    const dbDrivers = await this.activityRepo.findDriverEmailsById(
        redisDrivers.map((d) => d.id),
    );

    return redisDrivers.map((rd) => {
        const db     = dbDrivers.get(rd.id);
        const status: ActivityStatus =
        rd.tripStatus === "OFFLINE" ? "offline" : "online";

        return this.buildDto({
        id:             rd.id,
        fullName:       rd.driverName,
        email:          db?.email ?? `${rd.id}@driver.internal`,
        role:           "DRIVER",                // raw UserType
        status,
        lastLoginAt:    null,
        lastActiveAt:   new Date().toISOString(),
        device:         null,
        loginCountToday: 0,
        });
    });
  }

  private async buildRiderEntries(since: Date | null): Promise<ActivityLogDto[]> {
    const riderData = await this.activityRepo.findRidersWithDevices(since);
    return riderData.map(({ user, device }) => ({
        ...this.buildDto({
        id:             user.id,
        fullName:       user.fullName,
        email:          user.email,
        role:           "USER",                  // raw UserType
        status:         this.deriveRiderStatus(user),
        lastLoginAt:    null,
        lastActiveAt:   user.updatedAt.toISOString(),
        device,
        loginCountToday: 0,
        }),
    }));
  }

  // ─── DTO assembly ─────────────────────────────────────────────────────────

  private buildDto(input: {
    id:             string;
    fullName:       string;
    email:          string;
    role:           string;   // raw UserType — passed through unchanged
    status:         ActivityStatus;
    lastLoginAt:    string | null;
    lastActiveAt:   string;
    device:         ClientDevice | null;
    loginCountToday: number;
  }): ActivityLogDto {
    const { device } = input;
    const deviceType  = this.inferDeviceType(device);
    const ipAddress   = device?.ipAddress ?? "—";

    return {
        id:                  input.id,
        fullName:            input.fullName,
        email:               input.email,
        initials:            this.getInitials(input.fullName),
        role:                input.role,          // raw UserType — no mapping, no gradient
        status:              input.status,
        lastLoginAt:         input.lastLoginAt,
        lastActiveAt:        input.lastActiveAt,
        sessionDurationMins: this.computeSessionMins(input.lastLoginAt, input.status),
        device:              deviceType,
        os:                  this.parseOS(device?.name ?? null, deviceType),
        browser:             device?.name ?? "—",
        location:            this.resolveLocation(ipAddress),
        ipAddress,
        loginCountToday:     input.loginCountToday,
        // avatarGradient intentionally omitted — frontend derives it from role
    };
  }

  // ─── Status derivation ────────────────────────────────────────────────────

  /**
   * DB-based fallback for admins not found in Redis
   * (e.g. logged in before the interceptor was deployed).
   */
  private deriveAdminStatusFromDB(admin: Admin): ActivityStatus {
    if (!admin.lastLogin || !admin.isActive) return "offline";
    const minsAgo = dayjs().diff(dayjs(admin.lastLogin), "minute");
    if (minsAgo <=  5) return "online";
    if (minsAgo <= 60) return "idle";
    return "offline";
  }

  /**
   * Rider status from updatedAt proxy.
   * Not real-time — approximate. A fresh API call updates updatedAt.
   */
  private deriveRiderStatus(user: User): ActivityStatus {
    if (user.isDisabled || !user.isActive) return "offline";
    const minsAgo = dayjs().diff(dayjs(user.updatedAt), "minute");
    if (minsAgo <=  5) return "online";
    if (minsAgo <= 60) return "idle";
    return "offline";
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  private computeSummary(all: ActivityLogDto[]): ActivitySummaryDto {
    const onlineCount  = all.filter((e) => e.status === "online").length;
    const idleCount    = all.filter((e) => e.status === "idle").length;
    const offlineCount = all.filter((e) => e.status === "offline").length;

    const todayActiveCount = all.filter(
      (e) => e.status !== "offline" || e.loginCountToday > 0,
    ).length;

    const activeSessions = all.filter((e) => e.sessionDurationMins > 0);
    const avgSessionMins = activeSessions.length > 0
      ? Math.round(
          activeSessions.reduce((s, e) => s + e.sessionDurationMins, 0) /
          activeSessions.length,
        )
      : 0;

    return {
      onlineCount,
      idleCount,
      offlineCount,
      todayActiveCount,
      avgSessionMins,
      totalTracked: all.length,
    };
  }

  // ─── Pure utilities ───────────────────────────────────────────────────────

  private periodToDate(period: ActivityPeriod): Date | null {
    if (period === ActivityPeriod.TODAY) return dayjs().startOf("day").toDate();
    if (period === ActivityPeriod.WEEK)  return dayjs().subtract(7, "day").toDate();
    return null; // all time
  }

  private getInitials(fullName: string): string {
    return fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  private inferDeviceType(device: ClientDevice | null): ActivityDevice {
    if (!device) return "desktop";
    const name = (device.name ?? "").toLowerCase();
    if (name.includes("ipad") || name.includes("tab") || name.includes("tablet")) return "tablet";
    if (device.deviceFCMToken || name.includes("iphone") || name.includes("android")) return "mobile";
    return "desktop";
  }

  private parseOS(deviceName: string | null, deviceType: ActivityDevice): string {
    if (!deviceName) return deviceType === "desktop" ? "Web" : "Mobile";
    const n = deviceName.toLowerCase();
    if (n.includes("iphone"))                              return "iOS";
    if (n.includes("ipad"))                               return "iPadOS";
    if (n.includes("android") || n.includes("samsung"))   return "Android";
    if (n.includes("mac") || n.includes("macbook"))       return "macOS";
    if (n.includes("windows"))                            return "Windows";
    return deviceName;
  }

  private resolveLocation(ipAddress: string): string {
    if (
      !ipAddress ||
      ipAddress === "—" ||
      ipAddress.startsWith("127.") ||
      ipAddress.startsWith("192.168.") ||
      ipAddress.startsWith("10.")
    ) {
      return "Local";
    }

    try {
      // Clean mock-style masking if present (e.g., "197.210.64.xx")
      const cleanIp = ipAddress.replace(/\.xx/gi, ".1");
      const geo = geoip.lookup(cleanIp);
      if (geo) {
        return [geo.city, geo.country].filter(Boolean).join(", ");
      }
    } catch (err) {
      this.logger.debug(`[resolveLocation] geoip lookup failed for ${ipAddress}`);
    }

    return "Nigeria"; // safe default for PeppCruise
  }

  private computeSessionMins(lastLoginAt: string | null, status: ActivityStatus): number {
    if (!lastLoginAt || status === "offline") return 0;
    const mins = dayjs().diff(dayjs(lastLoginAt), "minute");
    return Math.min(Math.max(0, mins), 480); // cap at 8 hours
  }
}