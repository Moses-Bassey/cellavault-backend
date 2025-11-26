import { Controller, Get, Post, Body, UseGuards, Request, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CngConversionService } from '../services/cng-conversion.service';
import { CngStationService } from '../services/cng-station.service';
import { CreateCngConversionDto } from '../dto/cng-conversion.dto';
import { ResponseUtil } from 'src/utils/response.utils';
import { TRANSMISSION } from 'src/enums/transmission.enum';
import { FUEL_TYPE } from 'src/enums/fuel-type.enum';
import { ENGINE_CONDITION } from 'src/enums/engine-condition.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import type { Request as ExpressRequest } from 'express';
import { Validators } from 'src/utils/validators.utils';
import { UserType } from 'src/enums';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@ApiTags('CNG Conversion')
@Controller('cng-conversion')
@Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN, UserType.USER, UserType.DRIVER)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CngConversionController {
  constructor(
    private readonly cngConversionService: CngConversionService,
    private readonly cngStationService: CngStationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a CNG conversion request' })
  @ApiResponse({ status: 201, description: 'CNG conversion request created successfully' })
  async create(@Body() cngConversionData: CreateCngConversionDto, @Request() req: ExpressRequest & { user: JwtAuthPayload }) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.cngConversionService.create(userId, req.user.userType, cngConversionData);
    return ResponseUtil.handleResponse(data, 'CNG conversion request created successfully', HttpStatus.CREATED);
  }

  @Get('vehicle-transmissions')
  @ApiOperation({ summary: 'Get list of transmission types' })
  @ApiResponse({ status: 200, description: 'Transmission types retrieved successfully' })
  async getTransmissions() {
    const data = await this.cngConversionService.fetchTransmission();
    return ResponseUtil.handleResponse(data, 'Transmission types retrieved successfully', HttpStatus.OK);
  }

  @Get('stations')
  @ApiOperation({ summary: 'Get list of CNG stations' })
  @ApiResponse({ status: 200, description: 'CNG stations retrieved successfully' })
  async getStations() {
    const stations = await this.cngStationService.findAll();
    return ResponseUtil.handleResponse(stations, 'CNG stations retrieved successfully', HttpStatus.OK);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of CNG stations' })
  @ApiResponse({ status: 200, description: 'CNG stations retrieved successfully' })
  async fetchUserCngConversions(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.cngConversionService.fetchUserCngConversions(userId, page, limit)
    return ResponseUtil.handleResponse(data, 'Fetch cng conversions retrieved successfully', HttpStatus.OK);
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Get list of CNG stations' })
  @ApiResponse({ status: 200, description: 'CNG stations retrieved successfully' })
  async fetchUserCngConversionsStats(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.cngConversionService.fetchUserCngConversionsStats(userId);
    return ResponseUtil.handleResponse(data, 'Fetch cng conversions retrieved successfully', HttpStatus.OK);
  }
}

