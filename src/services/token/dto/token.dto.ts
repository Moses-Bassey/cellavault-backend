import { IsDate, IsString } from 'class-validator';

export class CreateCustomTokenDto {
  @IsString()
  email: string;

  @IsDate()
  expiry: Date;

  @IsString()
  subject: string;
}

export class VerifyCustomTokenDto {
  @IsString()
  token: string;
}
