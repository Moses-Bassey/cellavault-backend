import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import type { UserStatusFilter } from '../../../enums/user-status.enum';
import { UserStatus } from '../../../enums/user-status.enum';

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Search by name, phone, or email',
    example: 'ada',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by derived status',
    enum: ['active', 'inactive', 'pending', 'banned'],
    example: 'active',
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'pending', 'banned'])
  status?: UserStatusFilter;

  @ApiPropertyOptional({
    description: 'Items per page (1–50, default 20)',
    example: 10 ,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ description: 'Opaque cursor from previous response' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class UserListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phoneNo: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiPropertyOptional()
  imageUrl: string | null;

  @ApiProperty()
  totalRides: number;

  @ApiPropertyOptional()
  lastRide: string | null;

  @ApiProperty()
  joinDate: string;

  @ApiProperty()
  complaints: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserListPageDto {
  @ApiProperty({ type: [UserListItemDto] })
  items: UserListItemDto[];

  @ApiPropertyOptional()
  nextCursor: string | null;

  @ApiProperty()
  total: number;
}
