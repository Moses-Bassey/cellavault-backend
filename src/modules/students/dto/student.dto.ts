import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the student' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Student email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678', required: false, description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'guardian@example.com',
    required: false,
    description: 'Guardian phone or email (optional)',
  })
  @IsOptional()
  @IsString()
  guardianPhoneOrEmail?: string;

  @ApiProperty({
    example: 'strongPassword123!',
    required: false,
    description: 'Optional password. If omitted, a secure temporary password will be generated and emailed',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'female', required: false, description: 'Gender (optional)' })
  @IsOptional()
  gender: string;
}

export class StudentResponseDto {
  @ApiProperty({ example: 'uuid-v4-id' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: '+2348012345678', required: false })
  phone?: string | null;

  @ApiProperty({ example: 'female', required: false })
  gender?: string | null;

  @ApiProperty({ example: '2026-09-18T15:00:00.000Z' })
  createdAt: Date;
}
