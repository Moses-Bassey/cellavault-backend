import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../services/redis/services/redis.service';
import {
  DriversMapDataDto,
  DriverMapEntryDto,
  DriverVehicleMapDto,
  DriverCoordinatesDto,
  MapSearchDataDto,
  MapSearchResultDto,
} from '../dto/map.dto';

@Injectable()
export class MapService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Powers the admin live driver map.
   * Pure Redis — zero database round trips.
   */
  async getDriverLocations(): Promise<DriversMapDataDto> {
    const { drivers, totalOnTrip, totalOnline, totalOffline } =
      await this.redisService.getAllDriversForMap();

    const mapped: DriverMapEntryDto[] = drivers.map((d) => {
      const vehicle: DriverVehicleMapDto | null =
        d.plateNo || d.makeOfVehicle
          ? {
              name: d.makeOfVehicle,
              model: '', // not stored in Redis
              plateNumber: d.plateNo,
              imageUrl: null, // vehicle image not stored in Redis
              color: d.carColor,
            }
          : null;

      const coordinates: DriverCoordinatesDto = {
        latitude: d.latitude,
        longitude: d.longitude,
      };

      return {
        id: d.id,
        fullName: d.driverName,
        driverPhoto: d.driverPhoto,
        phoneNo: d.phoneNo,
        tripStatus: d.tripStatus,
        coordinates,
        vehicle,
      };
    });

    return { drivers: mapped, totalOnTrip, totalOnline, totalOffline };
  }

  /**
   * Map search endpoint handler.
   * Delegates to Redis service which returns from cache when warm.
   */
  async searchDrivers(query: string, limit: number,): Promise<MapSearchDataDto> {
    const raw = await this.redisService.searchDrivers(query, limit);

    const results: MapSearchResultDto[] = raw.map((d) => ({
      id:          d.id,
      fullName:    d.driverName,
      driverPhoto: d.driverPhoto,
      plateNumber: d.plateNo || null,
      tripStatus:  d.tripStatus,
      coordinates: { latitude: d.latitude, longitude: d.longitude },
    }));

    return { results, total: results.length };
  }
}