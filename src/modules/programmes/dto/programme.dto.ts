import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class GetProgrammesQueryDto {
  @ApiPropertyOptional({ description: 'Search term for programme name or description', example: 'Computer Science' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page size (1-50)', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Cursor for pagination (opaque string)' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class ProgrammeResponseDto {
  @ApiProperty({ example: 'uuid-v4-id' })
  id: string;

  @ApiProperty({ example: 'Computer Science' })
  name: string;

  @ApiProperty({ example: 'Programme description here', required: false })
  description?: string;

  @ApiProperty({ example: 120, required: false })
  hours?: number;

  @ApiProperty({ example: '2026-09-18T15:00:00.000Z' })
  createdAt: Date;
}
