import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StationService } from '../services/station.service';
import { StationBadge } from 'src/enums/station-badge.enum';
import type { StationSource } from '../dto/station.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import type { Request as ExpressRequest } from 'express';
import { Validators } from 'src/utils/validators.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Stations')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Get('all')
  async listStations(
    @Query('search') search?: string,
    @Query('status') status?: 'ACTIVE' | 'INACTIVE',
    @Query('stationType') stationType?: StationSource | 'ALL',
    @Query('badge') badge?: StationBadge,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.stationService.listStations({
      search,
      status,
      stationType,
      badge,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
    return ResponseUtil.handleResponse(data, 'Stations retrieved successfully', HttpStatus.OK);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get all stations metrics' })
  @ApiResponse({
    status: 200,
    description: 'Stations metrics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Stations metrics not found' })
  async getSummary() {
    const data = await this.stationService.getSummary();
    return ResponseUtil.handleResponse(data, 'Stations summary retrieved successfully', HttpStatus.OK);
  }

  @Get(':source/:id')
  async getDetails(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.getStationDetails(source, id);
    return ResponseUtil.handleResponse(data, 'Station\'s details retrieved successfully', HttpStatus.OK);
  }

  @Patch(':source/:id')
  async update(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
    @Body() body: any,
  ) {
    const data = await this.stationService.updateStation(source, id, body);
    return ResponseUtil.handleResponse(data, 'Station\'s details updated successfully', HttpStatus.OK);
  }

  @Post(':source/:id/activate')
  async activate(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.setStationActive(source, id, true);
    return ResponseUtil.handleResponse(data, 'Station activated successfully', HttpStatus.OK);
  }

  @Post(':source/:id/deactivate')
  async deactivate(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.setStationActive(source, id, false);
    return ResponseUtil.handleResponse(data, 'Station deactivated successfully', HttpStatus.OK);
  }
}
