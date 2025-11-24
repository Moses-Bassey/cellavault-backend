import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TRANSMISSION } from 'src/enums/transmission.enum';
import { FUEL_TYPE } from 'src/enums/fuel-type.enum';
import { ENGINE_CONDITION } from 'src/enums/engine-condition.enum';

export class CreateCngConversionDto {
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contact phone', example: '+2348100000000' })
  @IsString()
  @MaxLength(15)
  contactPhone: string;

  @ApiProperty({ description: 'National Identification Number', example: '12345678901' })
  @IsString()
  @MaxLength(11)
  nin: string;

  @ApiProperty({ description: 'Vehicle registration number', example: 'ABC123456' })
  @IsString()
  @MaxLength(100)
  vehicleRegisterationNo: string;

  @ApiProperty({ description: 'Brand of vehicle', example: 'Toyota' })
  @IsString()
  @MaxLength(100)
  brandOfVehicle: string;

  @ApiProperty({ description: 'Color', example: 'Black' })
  @IsString()
  @MaxLength(50)
  color: string;

  @ApiProperty({ description: 'Make of vehicle', example: 'Camry' })
  @IsString()
  @MaxLength(100)
  makeOfVehicle: string;

  @ApiProperty({ description: 'Year of manufacture', example: '2020' })
  @IsString()
  @MaxLength(4)
  yearOfManufacture: string;

  @ApiProperty({ description: 'VIN Number', example: '1HGBH41JXMN109186' })
  @IsString()
  @MaxLength(255)
  vinNumber: string;

  @ApiProperty({ description: 'Registration expiry date', example: '2025-12-31' })
  @IsDateString()
  registerationExpiryDate: string;

  @ApiProperty({ description: 'Engine capacity', example: '2.0L' })
  @IsString()
  @MaxLength(50)
  engineCapacity: string;

  @ApiProperty({ description: 'Cylinder', example: '4' })
  @IsString()
  @MaxLength(10)
  cylinder: string;

  @ApiProperty({ description: 'Engine condition', enum: ENGINE_CONDITION })
  @IsEnum(ENGINE_CONDITION)
  engineCondition: ENGINE_CONDITION;

  @ApiProperty({ description: 'Fuel type', enum: FUEL_TYPE })
  @IsEnum(FUEL_TYPE)
  fuelType: FUEL_TYPE;

  @ApiProperty({ description: 'Transmission', enum: TRANSMISSION })
  @IsEnum(TRANSMISSION)
  transmission: TRANSMISSION;

  @ApiProperty({ description: 'Mileage', example: '50000' })
  @IsString()
  @MaxLength(50)
  mileage: string;

  @ApiProperty({ description: 'Usual route', example: 'Lagos to Abuja' })
  @IsString()
  @MaxLength(200)
  usualRoute: string;

  @ApiProperty({ description: 'Operating motor park', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  operatingMotorPark?: string;

  @ApiProperty({ description: 'Conversion center', example: 'ABC Conversion Center' })
  @IsString()
  @MaxLength(200)
  conversionCenter: string;

  @ApiProperty({ description: 'Residential state', example: 'Lagos' })
  @IsString()
  @MaxLength(100)
  residentialState: string;

  @ApiProperty({ description: 'Local Government Area', example: 'Ikeja' })
  @IsString()
  @MaxLength(100)
  lga: string;

  @ApiProperty({ description: 'Address', example: '123 Main Street' })
  @IsString()
  @MaxLength(500)
  address: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  additionalNote?: string;
}

