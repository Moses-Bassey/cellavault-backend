import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { TokenSubject, TokenType } from 'src/enums/token.enum';

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

  @IsUUID()
  inviteeId?: string;
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
