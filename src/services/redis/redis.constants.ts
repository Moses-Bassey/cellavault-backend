/**
 * Plain **redis://** only (no TLS). When non-empty: used for all Redis clients; .env Redis ignored;
 * TLS is never applied (avoids SSL `wrong version number` on plain ports).
 * Set to `''` to use .env again (`REDIS_HOST` / `REDIS_URL` / `REDIS_TLS`).
 */
export const REDIS_CONNECTION_URL_DIRECT =
  'redis://default:xABrMxZ49KvuQW3u48D59yTHab9nvbEU@redis-15814.crce204.eu-west-2-3.ec2.cloud.redislabs.com:15814';

export function isUsingDirectRedisUrl(): boolean {
  return Boolean(REDIS_CONNECTION_URL_DIRECT?.trim());
}

/**
 * Redis connection URL from env, unless {@link REDIS_CONNECTION_URL_DIRECT} is set.
 */
export function resolveRedisUrlFromEnv(): string {
  const direct = REDIS_CONNECTION_URL_DIRECT?.trim();
  if (direct) return direct;

  const host = process.env.REDIS_HOST?.trim();
  if (host) {
    const port = process.env.REDIS_PORT?.trim() || '6379';
    const user = process.env.REDIS_USERNAME?.trim() || 'default';
    const pass = (process.env.REDIS_PASSWORD ?? '').trim();
    const u = encodeURIComponent(user);
    const p = pass ? encodeURIComponent(pass) : '';
    return p
      ? `redis://${u}:${p}@${host}:${port}`
      : `redis://${u}@${host}:${port}`;
  }

  const explicit = process.env.REDIS_URL?.trim();
  if (explicit) return explicit;

  return 'redis://localhost:6379';
}

/**
 * Use rediss:// only when you opt in with REDIS_TLS=true (or URL is already rediss://).
 *
 * Many Redis Cloud endpoints expose a **plain redis://** port; forcing TLS on those causes:
 * `SSL routines:ssl3_get_record:wrong version number` (client speaks TLS, server does not).
 */
export function normalizeRedisUrl(url: string): string {
  if (!url || url.startsWith('rediss://')) return url;

  const forcePlain =
    process.env.REDIS_TLS === 'false' ||
    process.env.REDIS_TLS === '0' ||
    process.env.REDIS_TLS === 'no';

  if (forcePlain) return url;

  const wantTls =
    process.env.REDIS_TLS === 'true' ||
    process.env.REDIS_TLS === '1' ||
    process.env.REDIS_USE_TLS === 'true';

  if (!wantTls) return url;

  let host = '';
  try {
    host = new URL(url.replace(/^redis:\/\//, 'http://')).hostname || '';
  } catch {
    /* ignore */
  }

  const isLocal =
    !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.');

  if (!isLocal) {
    return url.replace(/^redis:\/\//, 'rediss://');
  }
  return url;
}

/** TLS options for ioredis (some dev envs need REDIS_TLS_INSECURE=true if cert chain fails). */
export function redisTlsOptions(): { rejectUnauthorized: boolean } | undefined {
  const insecure =
    process.env.REDIS_TLS_INSECURE === 'true' ||
    process.env.REDIS_TLS_INSECURE === '1';
  return { rejectUnauthorized: !insecure };
}

/** Hash: driverId -> JSON(RedisDriver) for metadata (name, photo, car, etc.) */
export const REDIS_DRIVER_KEY = 'available_drivers';

/** GEO sorted set: online drivers by location. Member = driverId, position = longitude, latitude */
export const REDIS_DRIVERS_GEO_KEY = 'drivers:geo';

/**
 * TTL for `driver:{id}:heartbeat`, refreshed on go-online, location updates ({@link RedisService.addOrUpdateDriver}),
 * {@link RedisService.driverHeartbeat}, and availability changes. When it expires without refresh,
 * {@link HeartbeatExpirationWorker} takes the driver offline (Redis + DB).
 */
export const REDIS_HEARTBEAT_TTL_SEC = 120;

export function redisHeartbeatKey(driverId: string): string {
  return `driver:${driverId}:heartbeat`;
}

export function redisStatusKey(driverId: string): string {
  return `driver:${driverId}:status`;
}

export const DRIVER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy',
} as const;

// ─── Cache constants ──────────────────────────────────────────────────────────
// Shared between getDriverLocations and searchDrivers.
// One HGETALL every 15 s regardless of how many map loads or searches happen.

export const MAP_CACHE_KEY     = "admin:map:drivers:cache";
export const MAP_CACHE_TTL_SEC = 15; // matches frontend polling interval
