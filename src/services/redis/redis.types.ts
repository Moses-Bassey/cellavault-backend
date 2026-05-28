/**
 * Shape of the driver document stored in Redis when a driver goes online.
 * Used for addDriver and returned by getAvailableDrivers / getClosestAvailableDriver.
 * Extended fields are optional so existing Redis entries (e.g. from seeders) still parse.
 */
export interface RedisDriver {
  id: string;
  driverId?: string; // alias for id
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  driverName?: string;
  driverPhoto?: string | null;
  phoneNo?: string;        // ← add this
  carColor?: string;
  makeOfVehicle?: string;
  plateNo?: string;
  /** Set when listing drivers from a geo/radius query (km from search center). */
  distanceKm?: number;
}

/** @deprecated Use RedisDriver for new code. Kept for backward compatibility. */
export interface Driver extends RedisDriver {}
