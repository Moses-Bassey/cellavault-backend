import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpCode,
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

  /**
   * GET /admin/map/search?query=:query&limit=10
   *
   * Searches online drivers by name, plate number, or vehicle make.
   * Results are drawn from a 15-second Redis cache — 0 extra DB or
   * GEO queries. The first call after a cache miss costs the same
   * as a regular map load (HGETALL + pipeline); every subsequent
   * call within the TTL window is free.
   */
  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search drivers for the admin map' })
  async searchDrivers(
    @Query('query') query: string,
    @Query('limit') limit?: string,
  ) {
    // Return empty early — avoids any Redis work for trivial queries
    if (!query || query.trim().length < 2) {
      return ResponseUtil.handleResponse(
        { results: [], total: 0 },
        "Search results",
      );
    }

    const parsedLimit = Math.min(
      parseInt(limit ?? "10", 10) || 10,
      50, // hard cap — prevent accidentally returning 10 000 results
    );

    const data = await this.mapService.searchDrivers(query.trim(), parsedLimit);
    return ResponseUtil.handleResponse(data, "Search results");
  }
}
