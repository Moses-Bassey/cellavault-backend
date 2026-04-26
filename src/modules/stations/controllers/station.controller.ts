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
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StationService } from '../services/station.service';
import type { StationSource } from '../dto/station.dto';
import { GetStationsQueryDto, CreateStationDto } from '../dto/station.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Stations')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  @ApiOperation({ summary: 'Create stations' })
  @ApiResponse({
    status: 200,
    description: 'Station created successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to create station' })
  async createStation(@Body() body: CreateStationDto) {
    const data = await this.stationService.createStation(body);
    return ResponseUtil.handleResponse(
      data,
      'Station created',
      HttpStatus.CREATED,
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all stations' })
  @ApiResponse({
    status: 200,
    description: 'Stations retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Stations not found' })
  async listStations(@Query() query: GetStationsQueryDto) {
    const data = await this.stationService.listStations({
      search: query.search,
      status:
        query.status !== undefined
          ? query.status
            ? 'ACTIVE'
            : 'INACTIVE'
          : undefined,
      stationType: query.stationType,
      badge: query.badge,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
    });
    return ResponseUtil.handleResponse(
      data,
      'Stations retrieved successfully',
      HttpStatus.OK,
    );
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
    return ResponseUtil.handleResponse(
      data,
      'Stations summary retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':source/:id')
  @ApiOperation({ summary: 'Get station by id' })
  @ApiResponse({
    status: 200,
    description: 'Station retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getDetails(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.getStationDetails(source, id);
    return ResponseUtil.handleResponse(
      data,
      "Station's details retrieved successfully",
      HttpStatus.OK,
    );
  }

  @Patch(':source/:id')
  @ApiOperation({ summary: 'Update station details' })
  @ApiResponse({
    status: 200,
    description: 'Stations details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async update(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
    @Body() body: any,
  ) {
    const data = await this.stationService.updateStation(source, id, body);
    return ResponseUtil.handleResponse(
      data,
      "Station's details updated successfully",
      HttpStatus.OK,
    );
  }

  @Post(':source/:id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate station' })
  @ApiResponse({
    status: 200,
    description: 'Stations activated successfully',
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  @ApiResponse({ status: 400, description: 'Failed to activate station' })
  async activate(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.setStationActive(source, id, true);
    return ResponseUtil.handleResponse(
      data,
      'Station activated successfully',
      HttpStatus.OK,
    );
  }

  @Post(':source/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate station' })
  @ApiResponse({
    status: 200,
    description: 'Stations deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  @ApiResponse({ status: 400, description: 'Failed to deactivate station' })
  async deactivate(
    @Param('source') source: StationSource,
    @Param('id', UuidValidationPipe) id: string,
  ) {
    const data = await this.stationService.setStationActive(source, id, false);
    return ResponseUtil.handleResponse(
      data,
      'Station deactivated successfully',
      HttpStatus.OK,
    );
  }
}
