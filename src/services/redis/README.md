# Redis driver tracking (GEO + heartbeat)

## Configuration

**Recommended:** set split vars (they take priority over `REDIS_URL` if `REDIS_HOST` is set):

```bash
REDIS_HOST=redis-xxxxx.region.ec2.cloud.redislabs.com
REDIS_PORT=15814
REDIS_USERNAME=default
REDIS_PASSWORD=your_password
REDIS_TLS=true
```

Cloud hosts are auto-upgraded to **`rediss://`** (TLS). Or use a single line:

```bash
REDIS_URL=redis://default:password@host:port
```

**TLS:** Set **`REDIS_TLS=true`** only if your Redis URL/port expects **TLS** (`rediss://`). If you see **`wrong version number`** / SSL errors, your endpoint is **plain Redis** — set **`REDIS_TLS=false`** (or remove `REDIS_TLS`) and use **`redis://`** only.

**Troubleshooting**

| Issue | Fix |
|-------|-----|
| `ssl3_get_record:wrong version number` | **Plain-TCP port** — set `REDIS_TLS=false` (do not use `rediss://`). |
| Connection timeout / ECONNREFUSED | Confirm **public endpoint**, **password**, **IP allowlist** in Redis Cloud. |
| TLS cert errors (when using TLS) | Try `REDIS_TLS_INSECURE=true` once (debug only). |
| Password with `@` or `:` | Use split vars (`REDIS_PASSWORD=...`). |

For **automatic offline when the heartbeat key expires**, Redis must emit keyspace **expired** events. `HeartbeatExpirationWorker` subscribes and calls `DriverService.goOffline` (Redis + DB). On startup we try `CONFIG SET notify-keyspace-events Ex`; if your host blocks `CONFIG`, enable expired-key notifications in the provider dashboard.

**WebSocket `heartbeat`:** send `{ latitude, longitude }` like `update_location`; the server runs `updateLiveLocation` then refreshes the Redis heartbeat TTL.

## Data model

| Key | Type | Purpose |
|-----|------|---------|
| `drivers:geo` | GEO (sorted set) | Online drivers by location; member = `driverId` |
| `driver:{driverId}:heartbeat` | String, TTL (`REDIS_HEARTBEAT_TTL_SEC`) | Refreshed by REST/WS heartbeat; **expiry** → `HeartbeatExpirationWorker` → `goOffline` |
| `driver:{driverId}:status` | Hash | `status` (online \| offline \| busy), `last_seen` |
| `available_drivers` | Hash | `driverId` → JSON(RedisDriver) for metadata |

## Flows

- **Go online**: GEOADD, SET heartbeat EX 30, HSET status, store metadata in `available_drivers`.
- **Heartbeat** (REST or WS with coords): refresh TTL; WS also runs `updateLiveLocation` (GEO + `available_drivers` + DB).
- **Go offline**: last `/ws` disconnect, explicit API, `removeDriver`, or **heartbeat key TTL expired** (worker) — clears Redis and DB availability.

## APIs (unchanged)

- `addDriver` / `addOrUpdateDriver` → driver online (GEO + heartbeat + status).
- `removeDriver` → driver offline.
- `updateDriverAvailability(id, false)` → status **busy** (stays in GEO).
- `getAvailableDrivers(location?)` / `getClosestAvailableDriver` / `getNearbyDrivers` → use GEORADIUS when location is provided.

## WebSocket fan-out

After successful Redis mutations, `RedisService` emits the internal event `driver.realtime` (see `src/constants/driver-realtime.events.ts`). The booking app’s `RealtimeGateway` (`/ws`) forwards that to the `subscribers:available-drivers` room as `drivers:patch`. See `docs/WEBSOCKETS.md`.
