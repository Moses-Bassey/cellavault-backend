import {
  Controller,
  Get,
  Param,
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
import { TripService } from '../services/trip.service';
import { PaymentType, TripStatus } from '../entities/trip.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import type { Request as ExpressRequest } from 'express';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Trips')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('summary')
  async getSummary(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('withDelta') withDelta?: string,
  ) {
    const data = await this.tripService.getSummary({ from, to, withDelta });
    return ResponseUtil.handleResponse(
      data,
      'Trips summary retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get()
  async listTrips(
    @Query('search') search?: string,
    @Query('status') status?: TripStatus,
    @Query('paymentType') paymentType?: PaymentType,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const data = await this.tripService.listTrips({
      search,
      status,
      paymentType,
      limit: limit ? Number(limit) : undefined,
      cursor,
      from,
      to,
    });
    return ResponseUtil.handleResponse(
      data,
      'Trips retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':tripId')
  async getTripDetails(@Param('tripId', UuidValidationPipe) tripId: string) {
    const data = await this.tripService.getTripDetails(tripId);
    return ResponseUtil.handleResponse(
      data,
      'Trip details retrieved successfully',
      HttpStatus.OK,
    );
  }
}
