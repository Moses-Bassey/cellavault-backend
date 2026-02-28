import {
  Controller,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DriverService } from '../services/driver.service';
import { GetDriversQueryDto, UpdateDriverDto } from '../dto/driver.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Drivers')
@ApiBearerAuth()
@Auth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get all drivers metrics' })
  @ApiResponse({
    status: 200,
    description: 'Drivers metrics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Drivers metrics not found' })
  async getSummary() {
    const data = await this.driverService.getSummary();
    return ResponseUtil.handleResponse(
      data,
      "Drivers' summary retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({
    status: 200,
    description: 'Drivers retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Drivers not found' })
  async listDrivers(@Query() query: GetDriversQueryDto) {
    const data = await this.driverService.listDrivers({
      search: query.search,
      status: query.status,
      kycStatus: query.kycStatus,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });
    console.log('data: ', data);
    return ResponseUtil.handleResponse(
      data,
      'Drivers retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':driverId')
  @ApiOperation({ summary: 'Get driver by id' })
  @ApiResponse({
    status: 200,
    description: 'Driver retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async getDriver(@Param('driverId', UuidValidationPipe) driverId: string) {
    const data = await this.driverService.getDriverAccount(driverId);
    return ResponseUtil.handleResponse(
      data,
      'Driver retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':driverId')
  @ApiOperation({ summary: 'Update driver details' })
  @ApiResponse({
    status: 200,
    description: 'Driver updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async updateDriver(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Body()
    body: UpdateDriverDto,
  ) {
    const data = await this.driverService.updateDriverAccount(driverId, body);
    return ResponseUtil.handleResponse(
      data,
      'Driver details updated successfully',
      HttpStatus.OK,
    );
  }

  @Post(':driverId/suspend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suspend driver's account" })
  @ApiResponse({
    status: 200,
    description: 'Driver suspended successfully',
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async suspend(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Body() body: { reason?: string },
  ) {
    const data = await this.driverService.suspendDriver(driverId, body);
    return ResponseUtil.handleResponse(
      data,
      'Driver successfully suspended',
      HttpStatus.OK,
    );
  }

  @Post(':driverId/unsuspend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unsuspend driver's account" })
  @ApiResponse({
    status: 200,
    description: 'Driver unsuspended successfully',
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async unsuspend(@Param('driverId', UuidValidationPipe) driverId: string) {
    const data = await this.driverService.unsuspendDriver(driverId);
    return ResponseUtil.handleResponse(
      data,
      'Driver unsuspended successfully',
      HttpStatus.OK,
    );
  }
}
