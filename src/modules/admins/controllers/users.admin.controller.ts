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
import { AdminService } from '../services/admin.service';
import { UserAdminService } from '../services/user.admin.service';
import { ResponseUtil } from 'src/utils/response.utils';
import { UserType } from '../../../enums/user-type.enum';
import { Validators } from '../../../utils/validators.utils';
import type { AuthenticatedRequest } from '../../auth/auth.interface';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';
import { GetUsersQueryDto } from '../dto/user.dto';

@ApiTags('Users (Admin)')
@ApiBearerAuth()
@Auth()
@UseGuards(AuthGuard)
@Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
@Controller('admin/users')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users metrics' })
  @ApiResponse({
    status: 200,
    description: 'Users metrics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Users metrics not found' })
  @UseGuards(AuthGuard)
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  async getUsersData() {
    const data = await this.userAdminService.getUsersData();
    return ResponseUtil.handleResponse(
      data,
      'Users data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get('find')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    const data = await this.userAdminService.findAll({
      search: query.search,
      status: query.status,
      limit: query.limit,
      page: query.page,
    });

    return ResponseUtil.handleResponse(
      data,
      'Users retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  async getUserById(@Param('id', UuidValidationPipe) id: string) {
    const data = await this.userAdminService.findById(id);

    return ResponseUtil.handleResponse(
      data,
      'User retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id/suspend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.PEPP_MANAGER)
  async suspendUser(
    @Param('id', UuidValidationPipe) id: string,
    @Body() password: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const adminId = Validators.validateUuidV4(req.user.userId);
    await this.userAdminService.disableUser(id, adminId, password);
    return ResponseUtil.handleResponse({}, 'User disabled', HttpStatus.OK);
  }
}
