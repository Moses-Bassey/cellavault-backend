import {
  Controller,
  Get,
  Param,
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
import { TripService } from '../services/trip.service';
import { GetTripsQueryDto } from '../dto/trip.dto';
import { GetTripAnalyticsDto } from '../dto/trip-analytics.dto';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Trips')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get trip metrics' })
  @ApiResponse({
    status: 200,
    description: 'Trip metrics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Trip metrics not found' })
  async getSummary(@Query() query: GetTripsQueryDto) {
    const data = await this.tripService.getSummary({
      from: query.from,
      to: query.to,
      withDelta: query.withDelta,
    });
    return ResponseUtil.handleResponse(
      data,
      'Trips summary retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({
    status: 200,
    description: 'Trips retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Trips not found' })
  async listTrips(@Query() query: GetTripsQueryDto) {
    const data = await this.tripService.listTrips({
      search: query.search,
      status: query.status,
      paymentType: query.paymentType,
      limit: query.limit ? Number(query.limit) : undefined,
      cursor: query.cursor,
      from: query.from,
      to: query.to,
    });
    return ResponseUtil.handleResponse(
      data,
      'Trips retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  async getTripAnalytics(@Query() dto: GetTripAnalyticsDto) {
    const data = await this.tripService.getTripAnalytics(dto.period);
    return ResponseUtil.handleResponse(
      data,
      'Trip analytics retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':tripId')
  @ApiOperation({ summary: 'Get trip by id' })
  @ApiResponse({
    status: 200,
    description: 'Trip retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async getTripDetails(@Param('tripId', UuidValidationPipe) tripId: string) {
    const data = await this.tripService.getTripDetails(tripId);
    return ResponseUtil.handleResponse(
      data,
      'Trip details retrieved successfully',
      HttpStatus.OK,
    );
  }
}
