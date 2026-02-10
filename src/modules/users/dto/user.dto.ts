import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  isUUID,
  IsUrl,
} from 'class-validator';
import { UserType } from 'src/enums';

export class DashboardDto {
  @IsString()
  deviceFCMToken: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateImageUrlDto {
  @IsString()
  // @IsUrl()
  imageUrl: string;
}
