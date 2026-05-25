import {
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TripService } from '../services/trip.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Share Trips')
@Controller('trips/share')
export class TripsShareController {
  constructor(private readonly tripService: TripService) {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER, UserType.USER, UserType.DRIVER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':tripId/share')
  async generateShareLink(@Param('tripId', UuidValidationPipe) tripId: string) {
    const data = await this.tripService.generateShareLink(tripId);
    return ResponseUtil.handleResponse(
      data,
      'Trip details retrieved successfully',
      HttpStatus.OK,
    );
  }

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