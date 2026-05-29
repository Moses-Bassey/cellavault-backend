import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import {
  REDIS_DRIVER_KEY,
  redisHeartbeatKey,
  redisStatusKey,
  DRIVER_STATUS,
  normalizeRedisUrl,
  resolveRedisUrlFromEnv,
  redisTlsOptions,
  isUsingDirectRedisUrl,
  MAP_CACHE_KEY,
  MAP_CACHE_TTL_SEC,
} from '../redis.constants';
import { DriverTripStatus } from 'src/enums/driver-trip-status.enum';
import {
  RedisDriver,
  CachedMapResult,
  RawDriverMapEntry,
} from '../redis.types';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor() {
    const rawUrl = resolveRedisUrlFromEnv();
    const redisUrl = isUsingDirectRedisUrl()
      ? rawUrl
      : normalizeRedisUrl(rawUrl);
    if (!isUsingDirectRedisUrl() && rawUrl !== redisUrl) {
      this.logger.log('Redis URL upgraded to TLS (rediss://) (REDIS_TLS=true)');
    }
    if (isUsingDirectRedisUrl()) {
      this.logger.log(
        'Redis: using REDIS_CONNECTION_URL_DIRECT (plain redis://, .env ignored)',
      );
    }
    const useTls = redisUrl.startsWith('rediss://');
    const tlsOpts = useTls ? redisTlsOptions() : undefined;

    const options: RedisOptions = {
      retryStrategy: (times) => Math.min(times * 200, 2000),
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 15000,
      ...(useTls && tlsOpts && { tls: tlsOpts }),
    };

    this.client = new Redis(redisUrl, options);
    const displayUrl = redisUrl.replace(/:[^:@]+@/, ':***@') || redisUrl;
    this.logger.log(
      `Redis URL configured: ${displayUrl} (TLS=${useTls}, connectTimeout=10s)`,
    );

    this.client.on('connect', () => this.logger.log('✅ Connected to Redis'));
    this.client.on('error', (err) =>
      this.logger.error(
        `Redis error: ${err.message}`,
      ));
    this.client.on('reconnecting', () =>
      this.logger.warn(
        'Redis reconnecting...',
      ));
  }

  /** Exposes the Redis client (e.g. {@link HeartbeatExpirationWorker} subscribe). Prefer RedisService methods for driver GEO/metadata. */
  getClient(): Redis {
    return this.client;
  }


  async onModuleDestroy() {
    await this.client.quit();
  }


  private async ensureRedisReady(): Promise<void> {
    if (this.client.status === 'ready') return;
    try {
      await this.client.connect();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Redis connect failed (status=${this.client.status}): ${msg}. Check REDIS_URL / REDIS_HOST and network.`,
      );
    }
    // if (this.client.status !== 'ready') {
    //   throw new Error(`Redis not ready after connect (status=${this.client.status})`);
    // }
  }

  // ─── Private helper — builds or returns the cached map result ─────────────────

  /**
   * Returns the enriched driver list from a 15-second Redis string cache.
   *
   *   Cache HIT  → 0 Redis commands    (pure JSON.parse + return)
   *   Cache MISS → 2 Redis round trips  (HGETALL + pipeline)
   *                then stores result   (1 SET with EX)
   *
   * Both getAllDriversForMap() and searchDrivers() call this, so at most one
   * HGETALL runs per 15 s per NestJS instance, regardless of traffic.
   */
  private async getCachedMapResult(): Promise<CachedMapResult> {
    await this.ensureRedisReady();

    // ── Try cache first ─────────────────────────────────────────────────────
    const raw = await this.client.get(MAP_CACHE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as CachedMapResult;
      } catch {
        this.logger.warn("[getCachedMapResult] Cache corrupted — rebuilding.");
      }
    }

    // ── Cache miss: compute from Redis and store ─────────────────────────────
    const result = await this.computeAllDriversForMap(); // see note below

    // Fire-and-forget — don't block the response on the cache write
    this.client
      .setex(MAP_CACHE_KEY, MAP_CACHE_TTL_SEC, JSON.stringify(result))
      .catch((err) =>
        this.logger.error(`[getCachedMapResult] Failed to write cache: ${err.message}`),
      );

    return result;
  }

  /**
   * Fetches all driver locations and statuses from Redis for the admin map.
   *
   * ─── Complexity ─────────────────────────────────────────────────────────────
   *   Round trips : 2 (HGETALL  →  pipeline batch of 2N commands)
   *   Time        : O(N) where N = drivers currently in REDIS_DRIVER_KEY
   *   DB calls    : 0 — all data is sourced exclusively from Redis
   *
   * ─── Why HGETALL + pipeline instead of GEORADIUS ────────────────────────────
   *   GEORADIUS / GEOSEARCH require a center point + radius — they're designed
   *   for proximity queries, not "fetch everything". HGETALL on a Redis Hash
   *   returns all metadata (including embedded lat/lng) in a single call.
   *   The follow-up pipeline checks liveness (heartbeat TTL) and trip status
   *   without any DB joins.
   *
   * @returns Raw entries ready for MapService to shape into DriversMapDataDto.
   */
  private async computeAllDriversForMap(): Promise<CachedMapResult> {
    await this.ensureRedisReady();

    // ── Step 1: Single HGETALL — pulls every driver entry at once ────────────
    // For 10 k drivers @ ~300 B/entry ≈ 3 MB payload; typically < 10 ms.
    const allMeta = await this.client.hgetall(REDIS_DRIVER_KEY);

    const empty: CachedMapResult = {
      drivers: [],
      totalOnTrip: 0,
      totalOnline: 0,
      totalOffline: 0,
    };

    if (!allMeta || Object.keys(allMeta).length === 0) return empty;

    // ── Step 2: Parse — skip entries missing coordinates or malformed JSON ────
    const parsed: Array<{ id: string; driver: RedisDriver }> = [];

    for (const [hashField, json] of Object.entries(allMeta)) {
      if (!json) continue;
      try {
        const d = JSON.parse(json) as RedisDriver;
        const lat = d.latitude;
        const lng = d.longitude;
        if (
          typeof lat === 'number' && !Number.isNaN(lat) &&
          typeof lng === 'number' && !Number.isNaN(lng)
        ) {
          // Prefer d.id (set by goOnline) — fall back to the hash field name
          parsed.push({ id: d.id ?? d.driverId ?? hashField, driver: d });
        }
      } catch {
        // Malformed entry — log in debug, skip gracefully
        this.logger.debug(`[getAllDriversForMap] Skipped malformed entry for key "${hashField}"`);
      }
    }

    if (parsed.length === 0) return empty;

    // ── Step 3: Single pipeline batch — 2N commands, 1 round trip ─────────────
    //
    //   For driver at index i:
    //     results[i * 2]     → EXISTS heartbeat:driverId  (1 = alive, 0 = expired)
    //     results[i * 2 + 1] → HGET   status:driverId     ('ONLINE' | 'ON_TRIP' | null)
    //
    const pipeline = this.client.pipeline();
    for (const { id } of parsed) {
      pipeline.exists(redisHeartbeatKey(id));
      pipeline.hget(redisStatusKey(id), 'status');
    }
    const pipelineResults = await pipeline.exec();

    // ── Step 4: Assemble final entries ─────────────────────────────────────────
    const drivers: ReturnType<typeof this.getAllDriversForMap> extends Promise<{
      drivers: infer D,
    }>
      ? D
      : never = [];

    let totalOnTrip  = 0;
    let totalOnline  = 0;
    let totalOffline = 0;

    parsed.forEach(({ id, driver }, i) => {
      const heartbeatAlive = (pipelineResults?.[i * 2]?.[1] as number) === 1;
      const rawStatus = pipelineResults?.[i * 2 + 1]?.[1] as string | null;

      let tripStatus: DriverTripStatus;

      if (!heartbeatAlive) {
        // Heartbeat TTL expired → driver disconnected
        tripStatus = DriverTripStatus.OFFLINE;
      } else if (rawStatus === DRIVER_STATUS.BUSY) {
        tripStatus = DriverTripStatus.ON_TRIP;
      } else {
        // Alive heartbeat, no active trip
        tripStatus = DriverTripStatus.ONLINE;
      }

      if (tripStatus === DriverTripStatus.ON_TRIP) totalOnTrip++;
      else if (tripStatus === DriverTripStatus.ONLINE) totalOnline++;
      else totalOffline++;

      (drivers as any[]).push({
        id,
        driverName: driver.driverName ?? '',
        driverPhoto: driver.driverPhoto ?? null,
        phoneNo: driver.phoneNo ?? '',
        plateNo: driver.plateNo ?? '',
        makeOfVehicle: driver.makeOfVehicle ?? '',
        carColor: driver.carColor ?? '',
        latitude: driver.latitude,
        longitude: driver.longitude,
        tripStatus,
      });
    });

    this.logger.debug(
      `[getAllDriversForMap] ${drivers.length} drivers — ` +
        `${totalOnTrip} on trip / ${totalOnline} online / ${totalOffline} offline`,
    );

    return { drivers, totalOnTrip, totalOnline, totalOffline };
  }

  async getAllDriversForMap(): Promise<CachedMapResult> {
    return this.getCachedMapResult();
  }

  // ─── New: search drivers ──────────────────────────────────────────────────────

  /**
   * Searches active drivers by name, plate number, or vehicle make.
   * Runs entirely in Node.js on the cached driver array — zero extra Redis calls
   * when the cache is warm (which it is after the first map load).
   *
   * Complexity: O(N × Q) where N = drivers, Q = query length
   * For 5 000 drivers with a 5-char query: ~0.5 ms on a modern CPU.
   *
   * @param query  Minimum 2 characters (enforced by the controller).
   * @param limit  Maximum results to return (default 10).
   */
  async searchDrivers(query: string, limit = 10): Promise<RawDriverMapEntry[]> {
    const { drivers } = await this.getCachedMapResult();
    const q = query.trim().toLowerCase();

    const matches: RawDriverMapEntry[] = [];

    for (const d of drivers) {
      if (matches.length >= limit) break;

      const hitName  = d.driverName.toLowerCase().includes(q);
      const hitPlate = d.plateNo.toLowerCase().includes(q);
      const hitMake  = d.makeOfVehicle.toLowerCase().includes(q);

      if (hitName || hitPlate || hitMake) {
        matches.push(d);
      }
    }

    return matches;
  }
}
