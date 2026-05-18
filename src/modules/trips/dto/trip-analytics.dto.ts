import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TripAnalyticsPeriod } from '../../../enums/trip-analytics.enum';

export class GetTripAnalyticsDto {
  @ApiPropertyOptional({
    enum: TripAnalyticsPeriod,
    default: TripAnalyticsPeriod.TODAY,
    description: 'Aggregation window for chart data points',
  })
  @IsOptional()
  @IsEnum(TripAnalyticsPeriod)
  period: TripAnalyticsPeriod = TripAnalyticsPeriod.TODAY;
}