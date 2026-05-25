import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @MinLength(8)
  @MaxLength(50)
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  readonly password: string;
}