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
import { TripStatus } from '../../trips/entities/trip.entity';

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
  // Activity screen

  @Get(':driverId/summary')
  @ApiOperation({ summary: "Fetch driver's ride activity" })
  @ApiResponse({
    status: 200,
    description: "Driver's ride activity retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve driver's ride activity",
  })
  @ApiResponse({ status: 404, description: "Driver's ride activity not found" })
  async getActivitySummary(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.driverService.getDriverActivitySummary({
      driverId,
      from,
      to,
    });
    return ResponseUtil.handleResponse(
      data,
      "Driver's ride activity retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get(':driverId/rides')
  @ApiOperation({ summary: "Fetch driver's ride history" })
  @ApiResponse({
    status: 200,
    description: "Driver's ride history retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve driver's ride history",
  })
  @ApiResponse({ status: 404, description: "Driver's ride history not found" })
  async listRides(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: TripStatus,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.driverService.listDriverRides({
      driverId,
      from,
      to,
      status,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
    return ResponseUtil.handleResponse(
      data,
      "Driver's ride history retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get(':driverId/rides/:rideId')
  @ApiOperation({ summary: 'Fetch ride details' })
  @ApiResponse({
    status: 200,
    description: 'Ride details retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: "Failed to retrieve ride's details",
  })
  @ApiResponse({ status: 404, description: 'Ride details not found' })
  async getRideDetails(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Param('rideId', UuidValidationPipe) rideId: string,
  ) {
    const data = await this.driverService.getRideDetails(driverId, rideId);
    return ResponseUtil.handleResponse(
      data,
      'Ride details retrieved successfully',
      HttpStatus.OK,
    );
  }

  // @Patch(':driverId')
  // @ApiOperation({ summary: 'Update driver details' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Driver updated successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Driver not found' })
  // async updateDriver(
  //   @Param('driverId', UuidValidationPipe) driverId: string,
  //   @Body()
  //   body: UpdateDriverDto,
  // ) {
  //   const data = await this.driverService.updateDriverAccount(driverId, body);
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Driver details updated successfully',
  //     HttpStatus.OK,
  //   );
  // }

  // @Post(':driverId/suspend')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: "Suspend driver's account" })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Driver suspended successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Driver not found' })
  // async suspend(
  //   @Param('driverId', UuidValidationPipe) driverId: string,
  //   @Body() body: { reason?: string },
  // ) {
  //   const data = await this.driverService.suspendDriver(driverId, body);
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Driver successfully suspended',
  //     HttpStatus.OK,
  //   );
  // }

  // @Post(':driverId/unsuspend')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: "Unsuspend driver's account" })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Driver unsuspended successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Driver not found' })
  // async unsuspend(@Param('driverId', UuidValidationPipe) driverId: string) {
  //   const data = await this.driverService.unsuspendDriver(driverId);
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Driver unsuspended successfully',
  //     HttpStatus.OK,
  //   );
  // }
}
