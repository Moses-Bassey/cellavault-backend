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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { ResponseUtil } from 'src/utils/response.utils';
import { UserType } from '../../../enums/user-type.enum';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard)
@Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboardData() {
    const data = await this.adminService.getDashboardData();
    return ResponseUtil.handleResponse(
      data,
      'Dashboard data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', UuidValidationPipe) id: string) {
    const data = await this.adminService.findById(id);
    return ResponseUtil.handleResponse(
      data,
      `Admin retrieved successfully`,
      HttpStatus.OK,
    );
  }

  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const data = await this.adminService.findAll({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return ResponseUtil.handleResponse(
      data,
      'Admins retrieved successfully',
      HttpStatus.OK,
    );
  }
}
