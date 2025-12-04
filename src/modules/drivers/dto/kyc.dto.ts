import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  MinLength,
  IsAlpha,
  Matches,
} from 'class-validator';
import { GENDER } from 'src/enums/gender.enum';
import { IDENTIFICATION_TYPE } from 'src/enums/identification.enums';
import { PROOF_OF_ADDRESS_TYPE } from 'src/enums/proof-of-address-type.enum';

// KYC1 Personal Information DTO
export class CreateKyc1Dto {
  @ApiProperty({
    description: 'Driver full name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Matches(/^[A-Za-z _'-]+$/, {
    message: 'Only letters, spaces, underscores, apostrophes, and hyphens are allowed in fullName field'
  })
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+2348100000000',
  })
  @IsString()
  @MaxLength(15)
  phoneNo: string;

  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'Email address',
    example: 'driver@example.com',
  })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({
    description: 'Gender',
    example: GENDER.MALE,
    enum: GENDER,
  })
  @IsEnum(GENDER)
  gender: GENDER;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Phone brand',
    example: 'Samsung',
  })
  @IsString()
  @MaxLength(100)
  phoneBrand: string;

  @ApiProperty({
    description: 'Phone model',
    example: 'Galaxy S21',
  })
  @IsString()
  @MaxLength(100)
  phoneModel: string;

  @ApiProperty({
    description: 'School certificate image URL',
    example: 'https://example.com/certificate.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  schoolCertificateImageUrl?: string;

  @ApiProperty({
    description: 'Utility bill image URL',
    example: 'https://example.com/bill.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  utilityBillImageUrl?: string;
}

// KYC2 ID Information DTO
export class CreateKyc2Dto {
  @ApiProperty({
    description: 'Identification type',
    example: IDENTIFICATION_TYPE.NATIONAL_ID,
    enum: IDENTIFICATION_TYPE,
  })
  @IsEnum(IDENTIFICATION_TYPE)
  identificationType: IDENTIFICATION_TYPE;

  @ApiProperty({
    description: 'Identification number',
    example: '1234567890',
  })
  @IsString()
  @MaxLength(100)
  identificationNumber: string;

  @ApiProperty({
    description: 'Identification image URL',
    example: 'https://example.com/id.jpg',
  })
  @IsString()
  @MaxLength(1000)
  identificationImageUrl: string;
}

// KYC3 Residential Information DTO
export class CreateKyc3Dto {
  @ApiProperty({
    description: 'State ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  stateId: string;

  @ApiProperty({
    description: 'City name',
    example: 'Lagos',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  city: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Main Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  streetAddress?: string;

  @ApiProperty({
    description: 'Landmark',
    example: 'Near the shopping mall',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  landmark?: string;

  @ApiProperty({
    description: 'Postal or Zip code',
    example: '100001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalOrZipCode?: string;

  @ApiProperty({
    description: 'Proof of address type',
    example: PROOF_OF_ADDRESS_TYPE.UTILITY_BILL,
    enum: PROOF_OF_ADDRESS_TYPE,
    required: false,
  })
  @IsEnum(PROOF_OF_ADDRESS_TYPE)
  @IsOptional()
  proofOfAddressType?: PROOF_OF_ADDRESS_TYPE;

  @ApiProperty({
    description: 'Proof of address image URL',
    example: 'https://example.com/proof-of-address.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  proofOfAddressImage?: string;
}


export class ValidateBankAccountDto {
  @ApiProperty({
    description: 'Bank code',
    example: '044',
  })
  @IsString()
  @MaxLength(10)
  bankCode: string;

  @ApiProperty({
    description: 'Account number',
    example: '0123456789',
  })
  @IsString()
  @MaxLength(10)
  accountNo: string;
}


export class UpdateBankAccountDto {
  @ApiProperty({
    description: 'Bank code',
    example: '044',
  })
  @IsString()
  @MaxLength(10)
  bankCode: string;

  @ApiProperty({
    description: 'Account number',
    example: '0123456789',
  })
  @IsString()
  @MaxLength(10)
  accountNo: string;

  @ApiProperty({
    description: 'Account name',
    example: 'John Doe',
  })
  @IsString()
  @MaxLength(150)
  accountName: string;

  @ApiProperty({
    description: 'Bank Name',
    example: 'Access Bank',
  })
  @IsString()
  @MaxLength(150)
  bankName: string;
}

export class AddDriverLicenseDto {

  @ApiProperty({
    description: 'License image URL',
    example: 'https://example.com/license.jpg',
  })
  @IsString()
  @MaxLength(1000)
  licenseImageUrl: string;
}
