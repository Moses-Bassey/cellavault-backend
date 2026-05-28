import {
  Controller,
  Get,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MapService } from '../services/map.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Admin Map')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  /**
   *
   * Returns all active drivers from Redis with coordinates, vehicle info,
   * and real-time trip status. Powers the live admin map.
   *
   * Performance:
   *   - 2 Redis round trips (HGETALL + pipeline batch)
   *   - 0 database queries
   *   - ~5–15 ms for up to 5 000 drivers
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get online drivers locations' })
  @ApiResponse({
    status: 200,
    description: 'Driver locations retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Driver locations not found' })
  async getDriverLocations() {
    const data = await this.mapService.getDriverLocations();
    return ResponseUtil.handleResponse(
      data,
      'Driver locations retrieved successfully',
      HttpStatus.OK,
    );
  }
}
