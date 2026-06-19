import {
  IsString,
  IsNumber,
  IsOptional,
  IsNumberString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CarType } from '../entities/peppcruise-fees.entity';

export class CreateFeeDto {
  @ApiProperty({
    example: 'Economy',
  })
  @IsString()
  className: string;

  @ApiProperty({
    example: 500,
  })
  @IsNumber()
  @Min(0)
  baseFee: number;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @Min(0)
  piBaseFee: number;

  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  @Min(0)
  peppCoinBaseFee: number;

  @ApiProperty({
    example: 'Regular economy rides',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleImage?: string;

  @ApiProperty({
    example: 4,
  })
  @IsInt()
  @Min(1)
  vehicleSeaters: number;

  @ApiProperty({
    enum: CarType,
  })
  @IsEnum(CarType)
  carType: CarType;
}

export class UpdateFeeDto extends PartialType(
  CreateFeeDto,
) {}

export class FeeQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}