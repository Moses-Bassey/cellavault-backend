import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
// import { AdminService } from '../services/admin.service';
import { DashboardService } from '../services/dashboard.service';
import { ResponseUtil } from 'src/utils/response.utils';
import { UserType } from '../../../enums/user-type.enum';
import { Validators } from '../../../utils/validators.utils';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard)
@Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDashboardData() {
    const data = await this.dashboardService.getDashboardData();
    return ResponseUtil.handleResponse(
      data,
      'Dashboard data retrieved successfully',
      HttpStatus.OK,
    );
  }

  // @Patch(':id/suspend')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard)
  // @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  // async suspendUser(
  //   @Param('id', UuidValidationPipe) id: string,
  //   @Body() password: string,
  //   @Req() req: AuthenticatedRequest,
  // ) {
  //   const adminId = Validators.validateUuidV4(req.user.userId);
  //   await this.dashboardService.disableUser(id, adminId, password);
  //   return ResponseUtil.handleResponse({}, 'User disabled', HttpStatus.OK);
  // }
}
