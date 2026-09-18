import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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
