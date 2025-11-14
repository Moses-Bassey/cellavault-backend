import { Controller, Get, Param, Put, Delete, Body, UseGuards, Request, HttpCode, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { JwtAuthPayload } from '../../auth/auth.interface';
import { Validators } from 'src/utils/validators.utils';
import { DashboardDto } from '../dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async fetchuser(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.userService.fetchUser(userId);
    return ResponseUtil.handleResponse(
      data,
      'User info retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post('dashboard')
  @Roles(UserType.USER)
  @ApiOperation({ summary: 'Dashboard user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async dashboard(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Body() userData: DashboardDto,
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const ipAddress = req.ip;
    const data = await this.userService.dashboard({
      deviceFCMToken: userData.deviceFCMToken,
      ipAddress: ipAddress || '',
      name: userData.name || '',
    }, userId);
    return ResponseUtil.handleResponse(
      data,
      'User dashboard data retrieved successfully',
      HttpStatus.OK,
    );
  }

}
