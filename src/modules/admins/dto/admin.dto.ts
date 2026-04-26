import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsObject,
} from 'class-validator';
import { AdminType } from '../../../enums/user-type.enum';

export class UpdateAdminDto {
  @ApiProperty({
    description: "Admin's fullname",
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: "Admin's Email", example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: "Admin's password", example: '32rvn39nved' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "Admin's role",
    example: 'John Doe',
  })
  @IsEnum(AdminType)
  role: AdminType;

  @ApiProperty({
    description: "Admin account's verification status",
    example: 'example@gmail.com',
  })
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    description: "Admin account's active status",
    example: '32rvn39nved',
  })
  @IsString()
  @IsOptional()
  isActive?: boolean;
}
