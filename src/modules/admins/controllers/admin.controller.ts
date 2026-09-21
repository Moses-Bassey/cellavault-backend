import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { Validators } from 'src/utils/validators.utils';
// // import { DashboardDto, UpdateImageUrlDto } from '../dto/user.dto';
// import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';
// import { TripStatus } from 'src/enums/ride-status.enum';
// import { GetUsersQueryDto } from '../dto/admin.dto';

import { AdminService } from '../services/admin.service';
import {
  ChangeAdminPasswordDto,
  UpdateAdminProfileDto,
} from '../dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authenticated admin profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin account not found',
  })
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    const adminId = Validators.validateUuid(
      req.user.userId,
    );

    const data = await this.adminService.getMyProfile(
      adminId,
    );

    return ResponseUtil.handleResponse(
      data,
      'Admin profile retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update authenticated admin profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid profile data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async updateMyProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateAdminProfileDto,
  ) {
    const adminId = Validators.validateUuid(
      req.user.userId,
    );

    const data = await this.adminService.updateMyProfile(
      adminId,
      body,
    );

    return ResponseUtil.handleResponse(
      data,
      'Admin profile updated successfully',
      HttpStatus.OK,
    );
  }

  @Patch('profile/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change authenticated admin password',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password change request',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  async changeMyPassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: ChangeAdminPasswordDto,
  ) {
    const adminId = Validators.validateUuid(
      req.user.userId,
    );

    await this.adminService.changeMyPassword(
      adminId,
      body,
    );

    return ResponseUtil.handleResponse(
      null,
      'Admin password changed successfully',
      HttpStatus.OK,
    );
  }
}
