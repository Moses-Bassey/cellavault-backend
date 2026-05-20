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
import { UserType } from '../../../enums/user-type.enum';
export class CreateAdminDto {
  @ApiProperty({
    description: "Admin's fullname",
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({ description: "Admin's Email", example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Admin's password", example: '32rvn39nved' })
  @IsString()
  password: string;
}

export class InviteAdminDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNo: string;

  @IsEnum(UserType)
  role: UserType;
}
export class CompleteAdminOnboardingDto {
  @IsString()
  token: string;

  @MinLength(8)
  password: string;
}

export class AdminLoginDto {
  @ApiProperty({ description: "Admin's Email", example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Admin's password", example: '32rvn39nved' })
  @IsString()
  password: string;

  @ApiProperty({ description: "Token validity lifespan", example: false })
  @IsBoolean()
  rememberMe: boolean;
}

export class LoginOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  readonly password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @ApiProperty({ description: "Token validity lifespan", example: false })
  @IsBoolean()
  rememberMe: boolean;

  @ApiProperty({
    description: 'Device information',
    example: 'Web Browser',
  })
  @IsObject()
  deviceInfo: {
    deviceFCMToken?: string;
    name?: string;
  };

  @ApiProperty({
    description: 'Country',
    example: 'Country',
  })
  @IsOptional()
  readonly country?: string;
}
