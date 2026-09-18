import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { } from 'class-validator';

export class CreateTutorDto {
  @ApiProperty({
    description: 'Tutor\'s name',
    example: 'ada',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Tutor\'s email address',
    example: 'ada@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Tutor\'s phone no.',
    example: '2349123789464',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}


export class GetTutorsQueryDto {
  @ApiPropertyOptional({
    description: 'Search by name, phone, or email',
    example: 'ada',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Items per page (1–50, default 20)',
    example: 10 ,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ description: 'Opaque cursor from previous response' })
  @IsOptional()
  @IsString()
  cursor?: string;
}