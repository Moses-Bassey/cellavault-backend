import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientDeviceService } from '../services/client-device.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';

@ApiTags('Client Devices')
@Controller('client-devices')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientDeviceController {
  constructor(private readonly clientDeviceService: ClientDeviceService) {}

  @Get()
  @Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN)
  @ApiOperation({ summary: 'Get all client devices (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client devices retrieved successfully' })
  async findAll() {
    return await this.clientDeviceService.findAll();
  }

  @Get('my-devices')
  @ApiOperation({ summary: 'Get current user devices' })
  @ApiResponse({ status: 200, description: 'User devices retrieved successfully' })
  async getMyDevices(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'User not authenticated', statusCode: 401 };
    }
    return await this.clientDeviceService.findByUserId(userId);
  }

}
