import {
  Controller,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TripService } from '../services/trip.service';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Share Trips')
@Controller('admin/trips/share')
export class TripsShareController {
  constructor(private readonly tripService: TripService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Get shared trip details' })
  @ApiResponse({
    status: 200,
    description: 'Trip details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Shared trip not found' })
  async getSharedTrip(@Param('token') token: string) {
    console.log('token: ', token);
    const data = await this.tripService.getSharedTrip(
      token,
    );
    return ResponseUtil.handleResponse(
      data,
      'Trips summary retrieved successfully',
      HttpStatus.OK,
    );
  }
}