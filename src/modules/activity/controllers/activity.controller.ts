import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ActivityService } from '../services/activity.service';
import { GetActivityDto, ActivityStatusFilter, ActivityPeriod } from '../dto/activity.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';
import { ResponseUtil } from '../../../utils/response.utils';

@ApiTags('Admin — Activity Monitor')
@Controller('/admin/activity')
@UseGuards(AuthGuard)
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /**
   * GET /admin/activity
   *
   *    * Cursor-paginated, filterable activity log.
   *
   * First page:   GET /admin/activity?period=today&limit=10
   * Next page:    GET /admin/activity?period=today&limit=10&cursor=<nextCursor>
   *
   * The cursor is opaque — do not construct or parse it on the client.
   * Pass it back verbatim from the previous response's `data.nextCursor`.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activity log — login history and live status (Cursor-paginated activity log)' })
  async getActivity(@Query() dto: GetActivityDto) {
    const data = await this.activityService.getActivityLog(dto);
    return ResponseUtil.handleResponse(
      data,
      'Activity retrieved successfully',
      HttpStatus.OK,
    );
  }

  /**
   * GET /admin/activity/summary
   *
   * KPI-only. Lighter call for dashboard widgets that just need counts.
   * Response is a subset of the full /activity response.
   */
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activity KPI summary — for card widgets' })
  async getSummary() {
    const data = await this.activityService.getActivitySummary();
    return ResponseUtil.handleResponse(
      data,
      'Summary retrieved successfully', 
      HttpStatus.OK,
    );
  }

  /**
   * GET /admin/activity/online
   *
   * Currently online staff only — powers the avatar strip and recent feed
   * without loading the full paginated table.
   */
  @Get('online')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Currently online staff — avatar strip' })
  async getOnline() {
    const data = await this.activityService.getActivityLog({
      status: ActivityStatusFilter.ONLINE,
      period: ActivityPeriod.TODAY,
      limit: 50,
    });
    return ResponseUtil.handleResponse(
      { items: data.items, total: data.total },
      'Online staff retrieved',
      HttpStatus.OK,
    );
  }
}