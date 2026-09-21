import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({
    example: 'admin@example.com',
    description: 'New email address for the administrator',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ChangeAdminPasswordDto {
  @ApiProperty({
    example: 'CurrentPassword123!',
    description: 'Administrator current password',
  })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Administrator new password',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class AdminProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'admin@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'ADMIN',
  })
  role: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}