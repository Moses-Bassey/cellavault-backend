import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, HttpStatus, Delete} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleRegistration } from '../entities/vehicle-registration.entity';
import { VehicleRegistrationService } from '../services/vehicle-registration.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { Validators } from 'src/utils/validators.utils';
import type { Request as ExpressRequest } from 'express';
import { CreateVehicleRegistrationDto } from '../dto/vehicle-registration.dto';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Vehicle Registrations')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('drivers/vehicle-registrations')
export class VehicleRegistrationController {
  constructor(private readonly vehicleRegistrationService: VehicleRegistrationService) {}

  @Post()
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Add a vehicle registration to a driver' })
  @ApiResponse({ status: 201, description: 'Vehicle registration added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() vehicleRegistrationData: CreateVehicleRegistrationDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.vehicleRegistrationService.create(userId, vehicleRegistrationData);
    return ResponseUtil.handleResponse(data, 'Vehicle registration added successfully', HttpStatus.CREATED);
  }

  @Get()
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Get all vehicle registrations for a driver' })
  @ApiResponse({ status: 200, description: 'Vehicle registrations retrieved successfully' })
  async findByDriverId(@Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.vehicleRegistrationService.findByDriverId(userId);
    return ResponseUtil.handleResponse(data, 'Vehicle registrations retrieved successfully', HttpStatus.OK);
  }

  @Delete(':id')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Delete a vehicle registration' })
  @ApiResponse({ status: 200, description: 'Vehicle registration deleted successfully' })
  async deleteVehicleRegistration(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Param('id') id: string
  ) {
    const driverId = Validators.validateUuid(req.user.userId);
    const vehicleRegistrationId = Validators.validateUuid(id);
    const data = await this.vehicleRegistrationService.deleteVehicleRegistration(vehicleRegistrationId, driverId);
    return ResponseUtil.handleResponse({}, 'Vehicle registration deleted successfully', HttpStatus.OK);
  }

}

