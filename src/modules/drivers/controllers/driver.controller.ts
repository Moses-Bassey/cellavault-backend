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
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import type { Request as ExpressRequest } from 'express';
import { Validators } from 'src/utils/validators.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Drivers')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // @Get()
  // @Roles(UserType.DRIVER)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get a driver' })
  // @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  // @ApiResponse({ status: 404, description: 'Driver not found' })
  // async fetchDriver(@Request() req: ExpressRequest & { user: JwtAuthPayload }) {
  //   const userId = Validators.validateUuid(req.user.userId);
  //   const data = await this.driverService.fetchDriver(userId);
  //   return ResponseUtil.handleResponse(
  //     data,
  //     'Driver retrieved successfully',
  //     HttpStatus.OK,
  //   );
  // }
  @Get('summary')
  async getSummary() {
    const data = await this.driverService.getSummary();
    return ResponseUtil.handleResponse(
      data,
      "Drivers' summary retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Get()
  async listDrivers(
    @Query('search') search?: string,
    @Query('status')
    status?:
      | 'ACTIVE'
      | 'SUSPENDED'
      | 'INACTIVE'
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'VERIFIED'
      | 'REJECTED',
    @Query('kycStatus')
    kycStatus?:
      | 'APPROVED'
      | 'PENDING'
      | 'REJECTED'
      | 'PERSONAL_INFORMATION'
      | 'IDENTITY_INFORMATION'
      | 'RESIDENTIAL_INFORMATION'
      | 'ALL_COMPLETED'
      | 'NOT_COMPLETED',
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.driverService.listDrivers({
      search,
      status,
      kycStatus,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
    console.log('data: ', data);
    return ResponseUtil.handleResponse(
      data,
      'Drivers retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':driverId')
  async getDriver(@Param('driverId', UuidValidationPipe) driverId: string) {
    const data = await this.driverService.getDriverAccount(driverId);
    return ResponseUtil.handleResponse(
      data,
      'Driver retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':driverId')
  async updateDriver(
    @Param('driverId', UuidValidationPipe) driverId: string,
    @Body()
    body: {
      fullName?: string;
      email?: string;
      phoneNo?: string;
      imageUrl?: string;
      vehicleName?: string;
      vehiclePlate?: string;
      shortDescription?: string;
    },
  ) {
    const data = await this.driverService.updateDriverAccount(driverId, body);
    return ResponseUtil.handleResponse(
      data,
      'Driver details updated successfully',
      HttpStatus.OK,
    );
  }

  @Post(':driverId/suspend')
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
  async unsuspend(@Param('driverId', UuidValidationPipe) driverId: string) {
    const data = await this.driverService.unsuspendDriver(driverId);
    return ResponseUtil.handleResponse(
      data,
      'Driver unsuspended successfully',
      HttpStatus.OK,
    );
  }
}
