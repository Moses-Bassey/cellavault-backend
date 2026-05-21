import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  IsBoolean,
  IsOptional,
  IsEnum,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsLatitude,
  IsLongitude,
  IsNumber,
  Min,
  IsNotEmpty,
  IsPhoneNumber,
  IsTimeZone,
  Matches,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StationBadge } from 'src/enums/station-badge.enum';
import { Station_Source } from 'src/enums/station-source.enum';

export type StationSource = 'CNG' | 'CNG_CONVERSION' | 'EV_CHARGING';

export class StationsSummaryDto {
  totalStations: number;
  activeStations: number;
  inactiveStations: number;
  cngStations: number; // CNG + CNG_FUELING (or only one, depending on your meaning)
  evChargingStations: number; // ChargingStation
}

export class StationListRowDto {
  id: string;
  source: StationSource; // tells frontend which table it came from

  name: string;
  stationType: string; // label for UI (e.g. "CNG Station", "EV Station")
  location: string; // "Abuja, Nigeria" from state/country or address fallback
  address: string;

  isActive: boolean;
  stationBadge: StationBadge;

  updatedAt: string; // ISO
}

export class CursorPageDto<T> {
  items: T[];
  nextCursor: string | null;
}

export class StationDetailsDto {
  id: string;
  source: StationSource;

  name: string;
  state?: string | null;
  country?: string | null;
  address: string;

  contactPhone: string;
  contactEmail: string;

  stationBadge: StationBadge;

  openingTime: string;
  closingTime: string;

  amountPerUnit: number; // DECIMAL -> string
  amountPerUnitType: string;
  currency: string;

  rating?: number | null;
  reviews?: number | null;

  latitude?: number | null;
  longitude?: number | null;
  stationImage?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export class CreateStationDto {
  @ApiProperty({
    description: "Station's name",
    example: 'Pepp CNG Station Calabar',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Station type',
    enum: Station_Source,
    example: Station_Source.CNG,
  })
  @IsEnum(Station_Source)
  stationType: Station_Source;

  @ApiProperty({
    description: "Station's address",
    example: '123 Murtala Mohammed Highway, Calabar',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    description: "Station's state",
    example: 'Cross River',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({
    description: "Station's country",
    example: 'Nigeria',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({
    description: 'Official station contact phone number',
    example: '+2348012345678',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNo: string;

  @ApiProperty({
    description: 'Official station contact email',
    example: 'station@peppcruise.com',
  })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiPropertyOptional({
    description: 'Station badge',
    enum: StationBadge,
    example: StationBadge.PEPP_OWNED,
    default: StationBadge.DISCOVERY_ONLY,
  })
  @IsOptional()
  @IsEnum(StationBadge)
  stationBadge?: StationBadge;

  @ApiPropertyOptional({
    description: 'Daily opening time (24hr format)',
    example: '06:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openingTime must be in HH:mm format',
  })
  openingTime: string;

  @ApiPropertyOptional({
    description: 'Daily closing time (24hr format)',
    example: '22:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'closingTime must be in HH:mm format',
  })
  closingTime: string;

  @ApiPropertyOptional({
    description: 'Price per unit',
    example: 950,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amountPerUnit: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'NGN',
    default: 'NGN',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    description:
      'Measurement unit. Usually "kg" for CNG and "kwh" for EV charging',
    example: 'kg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  amountPerUnitType?: string;

  @ApiPropertyOptional({
    description: 'Whether station is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Station longitude coordinate',
    example: 8.341429,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Station latitude coordinate',
    example: 5.013869,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Station image URL',
    example:
      'https://cdn.peppcruise.com/stations/calabar-cng-station.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  stationImage?: string;

  /**
   * ============================================================
   * CNG / Fueling-specific optional fields
   * ============================================================
   */

  @ApiPropertyOptional({
    description: 'Number of dispensers available',
    example: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dispenserCount?: number;

  @ApiPropertyOptional({
    description: 'Storage capacity',
    example: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  storageCapacity?: number;

  @ApiPropertyOptional({
    description: 'Station operator/company name',
    example: 'Pepp Energy Ltd',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  operatorName?: string;

  @ApiPropertyOptional({
    description: 'Safety certifications',
    example: 'ISO 9001, SON Certified',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  safetyCertifications?: string;
}

export class UpdateStationDto {
  @ApiProperty({ description: "Station's name", example: 'Pepp CNG station' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: "Station's state", example: 'Cross River' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: "Station's country", example: 'Nigeria' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  country?: string;

  @ApiProperty({ description: "Station's address", example: '123 Main street' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  address: string;

  @ApiProperty({ description: "Station's telephone", example: '09117834575' })
  @IsString()
  @IsOptional()
  contactPhone: string;

  @ApiProperty({
    description: "Station's email address",
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: "Driver's badge", example: 'PEPP_OWNED' })
  @IsOptional()
  @IsEmail()
  stationBadge: StationBadge;

  @ApiProperty({
    description: "Station's opening time (HH:mm format)",
    example: '07:30',
  })
  @IsOptional()
  @IsString()
  openingTime: string;

  @ApiProperty({
    description: "Station's closing time (HH:mm format)",
    example: '20:30',
  })
  @IsOptional()
  @IsString()
  closingTime: string;

  @ApiProperty({ description: "Station's amount per unit", example: 750.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPerUnit: number;

  @ApiProperty({ description: "Station's unit type", example: 'kg' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  amountPerUnitType: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'NGN',
    default: 'NGN',
  })
  @IsOptional()
  @IsString()
  currency: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: 6.5244,
    type: Number,
  })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: 3.3792,
    type: Number,
  })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({
    description: "Station's image",
    example: 'profile.png',
  })
  @IsString()
  @IsOptional()
  stationImage?: string;

  @ApiPropertyOptional({
    description: 'Whether the station is active (defaults to true)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetStationsQueryDto {
  @ApiProperty({ description: 'Search parameter', example: 'Pepp cng station' })
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ description: 'Filter by station type', example: 'CNG' })
  @IsOptional()
  @IsEnum(Station_Source)
  stationType?: Station_Source;

  @ApiProperty({
    description: 'Filter by station badge',
    example: 'PEPP_OWNED',
  })
  @IsOptional()
  @IsEnum(StationBadge)
  badge?: StationBadge;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  limit?: string | number;

  @ApiProperty({
    description: 'Cursor for optimized pagination',
    example: null,
  })
  @IsOptional()
  cursor?: string;
}
