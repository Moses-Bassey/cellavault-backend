import { Controller, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';

@ApiTags('Drivers')
@ApiBearerAuth()
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async findById(@Param('id') id: string): Promise<Driver | null> {
    return await this.driverService.findById(id);
  }

  @Put('dashboard')
  @ApiOperation({ summary: 'Driver dashboard' })
  @ApiResponse({ status: 200, description: 'Driver dashboard data' })
  async dashboard(
    @Body() driverData: Partial<Driver>,
  ){
    // return await this.driverService.dashboard();
  }
}

