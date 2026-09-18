import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class RegisterStudentProgrammeDto {
  @ApiProperty({ description: 'Programme ID (UUID)', example: 'uuid-programme-id' })
  @IsUUID()
  programmeId: string;
}

export class StudentProgrammeResponseDto {
  @ApiProperty({ example: 'uuid-v4-id' })
  id: string;

  @ApiProperty({ example: 'uuid-student-id' })
  studentId: string;

  @ApiProperty({ example: 'uuid-programme-id' })
  programmeId: string;

  @ApiProperty({ example: '2026-09-18T15:00:00.000Z' })
  createdAt: Date;
}

export class GetStudentProgrammesQueryDto {
  @ApiPropertyOptional({ description: 'Search term for student or programme ID', example: 'uuid-student-id' })
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
