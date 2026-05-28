import { ApiProperty } from '@nestjs/swagger';
import { DriverTripStatus } from 'src/enums/driver-trip-status.enum';

export class DriverVehicleMapDto {
  @ApiProperty({ example: 'Toyota' })
  name: string;

  @ApiProperty({ example: '' })
  model: string; // not stored in Redis — empty string, not null

  @ApiProperty({ example: 'ABI 234 XY' })
  plateNumber: string;

  @ApiProperty({ nullable: true })
  imageUrl: string | null; // vehicle image not in Redis

  @ApiProperty({ example: 'Black' })
  color: string;
}

export class DriverCoordinatesDto {
  @ApiProperty({ example: 9.0641 })
  latitude: number;

  @ApiProperty({ example: 7.4911 })
  longitude: number;
}

export class DriverMapEntryDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ nullable: true })
  driverPhoto: string | null;

  @ApiProperty({ example: '+234 801 234 5678' })
  phoneNo: string;

  @ApiProperty({ enum: DriverTripStatus })
  tripStatus: DriverTripStatus;

  @ApiProperty({ type: DriverCoordinatesDto })
  coordinates: DriverCoordinatesDto;

  @ApiProperty({ type: DriverVehicleMapDto, nullable: true })
  vehicle: DriverVehicleMapDto | null;
}

export class DriversMapDataDto {
  @ApiProperty({ type: [DriverMapEntryDto] })
  drivers: DriverMapEntryDto[];

  @ApiProperty({ example: 3 })
  totalOnTrip: number;

  @ApiProperty({ example: 5 })
  totalOnline: number;

  @ApiProperty({ example: 2 })
  totalOffline: number;
}