import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// ─── Query ────────────────────────────────────────────────────────────────────

export enum ActivityRoleGroup {
  ALL = 'all',
  ADMIN = 'admin',
  DRIVER = 'driver',
  RIDER = 'rider',
}

export enum ActivityStatusFilter {
  ALL = 'all',
  ONLINE = 'online',
  IDLE = 'idle',
  OFFLINE = 'offline',
}

export enum ActivityPeriod {
  TODAY = 'today',
  WEEK = 'week',
  ALL = 'all',
}

export class GetActivityDto {
  @ApiPropertyOptional({ enum: ActivityRoleGroup, default: ActivityRoleGroup.ALL })
  @IsOptional()
  @IsEnum(ActivityRoleGroup)
  roleGroup?: ActivityRoleGroup = ActivityRoleGroup.ALL;

  @ApiPropertyOptional({ enum: ActivityStatusFilter, default: ActivityStatusFilter.ALL })
  @IsOptional()
  @IsEnum(ActivityStatusFilter)
  status?: ActivityStatusFilter = ActivityStatusFilter.ALL;

  @ApiPropertyOptional({ enum: ActivityPeriod, default: ActivityPeriod.TODAY })
  @IsOptional()
  @IsEnum(ActivityPeriod)
  period?: ActivityPeriod = ActivityPeriod.TODAY;

  @ApiPropertyOptional({ description: 'Partial match on fullName, email, or location' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  search?: string;

  @ApiPropertyOptional({
    description: 'Opaque cursor returned by the previous response. Omit for the first page.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(50)
  limit?: number = 10;
}

// ─── Response item ────────────────────────────────────────────────────────────

export type ActivityStatus = 'online' | 'idle' | 'offline';
export type ActivityDevice = 'desktop' | 'mobile' | 'tablet';

/**
 * Backend returns raw DB / enum values only — no Tailwind classes, no
 * computed presentation strings. The frontend owns all visual mapping.
 *
 *   role       ← raw UserType string, e.g. "SUPER_ADMIN", "DRIVER", "USER"
 *   device     ← inferred device category
 *   os         ← parsed from ClientDevice.name
 *   ipAddress  ← real IP from ClientDevice
 *   location   ← resolved via geoip-lite
 */
export class ActivityLogDto {
  id: string;
  fullName: string;
  email: string;
  initials: string;
  role: string; // raw UserType — frontend maps to display label + colour
  status: ActivityStatus;
  lastLoginAt: string | null;
  lastActiveAt: string;
  sessionDurationMins: number;
  device: ActivityDevice;
  os: string;
  browser: string;
  location: string;
  ipAddress: string;
  loginCountToday: number;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export class ActivitySummaryDto {
  onlineCount: number;
  idleCount: number;
  offlineCount: number;
  todayActiveCount: number;
  avgSessionMins: number;
  totalTracked: number;
}

// ─── Paginated response ───────────────────────────────────────────────────────

export class ActivityDataDto {
  items: ActivityLogDto[];
  /** Full filtered count — independent of cursor window. */
  total: number;
  /** Opaque cursor to pass as `cursor=` on the next request. Null on last page. */
  nextCursor: string | null;
  summary: ActivitySummaryDto;
}