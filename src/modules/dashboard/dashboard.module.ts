import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { DriversModule } from '../drivers/drivers.module';
import { UsersModule } from '../users/users.module';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [AuthModule, DriversModule, UsersModule, TripsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [],
})
export class DashboardModule {}
