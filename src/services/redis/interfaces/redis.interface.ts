import { DriverTripStatus } from 'src/enums/driver-trip-status.enum';

export interface RawDriverMapEntry {
  id: string;
  driverName: string;
  driverPhoto: string | null;
  phoneNo: string;
  plateNo: string;
  makeOfVehicle: string;
  carColor: string;
  latitude: number;
  longitude: number;
  tripStatus: DriverTripStatus;
}

export interface RawDriverMapResult {
  drivers: RawDriverMapEntry[];
  totalOnTrip: number;
  totalOnline: number;
  totalOffline: number;
}