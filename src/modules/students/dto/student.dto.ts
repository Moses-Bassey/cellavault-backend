import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength,
  IsUrl, IsIn, IsInt, Min } from 'class-validator';

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

export class GetStudentsQueryDto {
  @ApiPropertyOptional({ description: 'Search term for name, email or phone', example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by gender', example: 'male' })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female'], { each: false })
  gender?: string;

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

export class UpdateStudentProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Student full name',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Student email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '08012345678',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '08098765432',
    nullable: true,
    description: 'Guardian phone number or email address',
  })
  @IsOptional()
  @IsString()
  guardianPhoneOrEmail?: string;

  @ApiPropertyOptional({
    example: 'Male',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}

export class ChangeStudentPasswordDto {
  @ApiProperty({
    example: 'CurrentPassword123!',
  })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}