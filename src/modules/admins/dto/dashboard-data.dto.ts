import { IsNumber, IsObject } from 'class-validator';

export class DashboardDataDto {
  @IsNumber()
  ongoingTrips: number;

  @IsNumber()
  activeDrivers: number;

  @IsNumber()
  activeUsers: number;

  @IsNumber()
  pendingDisputes: number;

  @IsNumber()
  pendingPayouts: number;

  @IsObject()
  revenueStats: {
    totalRevenue: number;
    monthlyBreakdown: [];
  };

  @IsObject()
  todayStats: {
    profit: number;
    trips: number;
    hourlyChart: [];
  };
}
