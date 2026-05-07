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
} from 'class-validator';
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
  @ApiProperty({ description: "Station's name", example: 'Pepp CNG station' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Filter by station type', example: 'CNG' })
  @IsEnum(Station_Source)
  stationType: Station_Source;

  @ApiProperty({ description: "Station's address", example: '123 Main street' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  @ApiProperty({ description: "Station's state", example: 'Cross River' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: "Station's country", example: 'Nigeria' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;
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
