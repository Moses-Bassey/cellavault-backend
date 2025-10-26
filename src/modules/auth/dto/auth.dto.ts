import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { min } from 'date-fns';
import { LoginType } from 'src/enums/login-type.enum';
import { TokenSubject } from 'src/enums/token.enum';


export class SignUpUserDto {
  // @ApiProperty({
  //   description: 'Login type',
  //   example: 'NORMAL',
  // })
  // @IsEnum(LoginType)
  // readonly loginType: LoginType;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @MaxLength(320)
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User Phone No',
    example: '+234 8100000000',
  })
  @IsString()
  @MaxLength(15)
  phoneNo: string;

  @IsString()
  @MaxLength(6)
  otpPhone: string;

  @IsString()
  @MaxLength(6)
  otpEmail: string;

  @ApiProperty({
    description: 'Country',
    example: 'Country',
  })
  @IsString()
  @IsUUID()
  country: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(4)
  readonly fullName: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'User email address or phone number',
    example: 'user@example.com or 08100000000',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  readonly identity: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  readonly password: string;

  // @ApiProperty({
  //   description: 'Login type',
  //   example: 'NORMAL',
  // })
  // @IsString()
  // readonly loginType: LoginType;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address to send password otp',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token to reset password',
    example: 'token123',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'newPassword123',
  })
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    description: 'Email address to reset password',
    example: 'user@example.com',
  })
  @IsEmail()
  public email: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldPassword123',
  })
  @IsString()
  readonly oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
  })
  @IsString()
  readonly newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'newPassword123',
  })
  @IsString()
  readonly confirmPassword: string;
}

export class ResendOtpDto {
  @ApiProperty({
    description: 'Email address to resend OTP',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;
}

export class SignupEmail {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;
}

export class SignupPhone {
  @ApiProperty({
    description: 'PhoneNo sign up phone',
    example: '08100000000',
  })
  @IsString()
  readonly phoneNo: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Token to verify OTP',
    example: 'token123',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Email to verify OTP',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'PhoneNo to verify OTP',
    example: '08100000000',
  })
  @IsString()
  @IsOptional()
  phoneNo: string;

  @IsString()
  @IsOptional()
  readonly subject: TokenSubject;
}

export class SignUserDto {

  @ApiProperty({
    description: 'User Name',
    example: 'John Doe',
  })
  @IsString()
  readonly fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User Phone',
    example: '8100000000',
  })
  @IsString()
  readonly phoneNo: string;

  @ApiProperty({
    description: 'Country ',
    example: 'Country',
  })
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  readonly password: string;
}