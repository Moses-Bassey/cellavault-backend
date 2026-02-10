import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVehicleRegistrationDto {
  @ApiProperty({
    description: 'Vehicle registration number',
    example: 'ABC123456',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  vehicleRegisterationNo: string;

  @ApiProperty({
    description: 'Brand of vehicle',
    example: 'Toyota',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  brandOfVehicle: string;

  @ApiProperty({
    description: 'Color of vehicle',
    example: 'Black',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  color: string;

  @ApiProperty({
    description: 'Make of vehicle',
    example: 'Camry',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  makeOfVehicle: string;

  @ApiProperty({
    description: 'VIN Number',
    example: '1HGBH41JXMN109186',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  vinNumber: string;

  @ApiProperty({
    description: 'Registration expiry date',
    example: '2025-12-31',
    required: false,
  })
  @IsDateString()
  registerationExpiryDate: string;

  @ApiProperty({
    description: 'Plate number image URL',
    example: 'https://example.com/plate.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  plateNumberUrl: string;

  @ApiProperty({
    description: 'Plate number',
    example: 'ABC-123',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  plateNo: string;
}
