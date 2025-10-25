import { IsDate, IsOptional, IsString } from 'class-validator';
import { TokenSubject } from 'src/enums/token.enum';

export class CreateTokenDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNo?: string;

  @IsDate()
  expiry: Date;

  @IsString()
  subject: TokenSubject;
}

export class VerifyCustomTokenDto {
  @IsString()
  token: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phoneNo: string;
}
