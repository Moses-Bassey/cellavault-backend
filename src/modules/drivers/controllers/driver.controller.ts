import { Controller, Get, Param, Put, Delete, Body, Request, UseGuards, HttpStatus, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from '../services/driver.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import type { Request as ExpressRequest } from 'express';
import { Validators } from 'src/utils/validators.utils';
import { DashboardDto } from 'src/modules/users/dto/user.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @Roles(UserType.DRIVER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a driver' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async fetchDriver(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.fetchDriver(userId);
    return ResponseUtil.handleResponse(
      data,
      'Driver retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post('dashboard')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Driver dashboard' })
  @ApiResponse({ status: 200, description: 'Driver dashboard data' })
  async dashboard(
    @Body() reqBody: DashboardDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const ipAddress = req.ip;
    const data = await this.driverService.dashboard({
      ipAddress: ipAddress || '',
      name: reqBody.name || '',
      deviceFCMToken: reqBody.deviceFCMToken,
    }, userId);
    return ResponseUtil.handleResponse(
      data,
      'Driver dashboard data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Put('driver-type')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Driver dashboard' })
  @ApiResponse({ status: 200, description: 'Driver dashboard data' })
  async setDriverType(
    @Body() reqBody: { isPeppcruiseDriver: boolean },
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.setDriverType(userId, reqBody.isPeppcruiseDriver);
    return ResponseUtil.handleResponse(
      {},
      'Request successfull',
      HttpStatus.OK,
    );
  }
}

