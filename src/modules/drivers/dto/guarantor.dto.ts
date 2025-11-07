import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGuarantorDto {
  @ApiProperty({
    description: 'Guarantor full name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+2348100000000',
  })
  @IsString()
  @MaxLength(15)
  phoneNo: string;

  @ApiProperty({
    description: 'Email address',
    example: 'guarantor@example.com',
  })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({
    description: 'Identification image URL',
    example: 'https://example.com/id.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  identificationImageUrl?: string;

  @ApiProperty({
    description: 'Utility bill image URL',
    example: 'https://example.com/bill.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  utilityBillImageUrl?: string;

  @ApiProperty({
    description: 'Police clearance image URL',
    example: 'https://example.com/clearance.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  policeClearanceImageUrl?: string;
}

export class CreateGuarantorsDto {
  @ApiProperty({
    description: 'Array of guarantors to create',
    type: [CreateGuarantorDto],
    example: [
      {
        fullName: 'John Doe',
        phoneNo: '+2348100000000',
        email: 'john@example.com',
        identificationImageUrl: 'https://example.com/id.jpg',
        utilityBillImageUrl: 'https://example.com/bill.jpg',
        policeClearanceImageUrl: 'https://example.com/clearance.jpg',
      },
      {
        fullName: 'Jane Smith',
        phoneNo: '+2348100000001',
        email: 'jane@example.com',
        identificationImageUrl: 'https://example.com/id2.jpg',
        utilityBillImageUrl: 'https://example.com/bill2.jpg',
        policeClearanceImageUrl: 'https://example.com/clearance2.jpg',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateGuarantorDto)
  guarantors: CreateGuarantorDto[];
}

