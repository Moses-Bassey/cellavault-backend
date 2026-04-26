import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  isUUID,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { UserType } from 'src/enums';

export class DashboardDto {
  @IsString()
  deviceFCMToken: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateImageUrlDto {
  @IsString()
  // @IsUrl()
  imageUrl: string;
}

export class GetUsersQueryDto {
  @ApiProperty({ description: 'Search parameter', example: 'john' })
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', example: true })
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;

    const normalized: string = value.toString().toLowerCase();
    console.log('Type value: ', normalized);
    if (['true', '1'].includes(normalized)) return true;
    if (['false', '0'].includes(normalized)) return false;

    // Throw error for invalid values
    throw new UnprocessableEntityException(
      `Invalid status value: "${value}". Allowed values are true, false, 1, 0.`,
    );
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  limit?: number | string;

  @ApiProperty({ description: 'Page number', example: 1 })
  @IsOptional()
  cursor?: string;
}
