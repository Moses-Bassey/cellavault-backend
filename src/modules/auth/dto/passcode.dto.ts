import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePasscodeDto {
  @ApiProperty({
    description: '6-digit passcode',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ChangePasscodeDto {
  @ApiProperty({
    description: '6-digit passcode',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  newPassCode: string;

  @ApiProperty({
    description: '6-digit passcode',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  oldPasscode: string;
}

export class VerifyPasscodeDto {
  @ApiProperty({
    description: '6-digit passcode to verify',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ResetPasscodeDto {
  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @ApiProperty({
    description: 'New 6-digit passcode',
    example: '654321',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  newCode: string;

  @ApiProperty({
    description: 'Confirm new 6-digit passcode',
    example: '654321',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  confirmCode: string;
}
