import { Controller, Get, Param, Put, Delete, Body, Request, UseGuards, HttpStatus, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from '../services/driver.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { ResponseUtil } from 'src/utils/response.utils';
import type { Request as ExpressRequest } from 'express';
import { Validators } from 'src/utils/validators.utils';
import { DashboardDto } from 'src/modules/users/dto/user.dto';
import { monifyAPI } from '../utils/monnify';
import { AddDriverLicenseDto, UpdateBankAccountDto, ValidateBankAccountDto } from '../dto/kyc.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @Roles(UserType.DRIVER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a driver' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async fetchDriver(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.fetchDriver(userId);
    return ResponseUtil.handleResponse(
      data,
      'Driver retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post('dashboard')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Driver dashboard' })
  @ApiResponse({ status: 200, description: 'Driver dashboard data' })
  async dashboard(
    @Body() reqBody: DashboardDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const ipAddress = req.ip;
    const data = await this.driverService.dashboard({
      ipAddress: ipAddress || '',
      name: reqBody.name || '',
      deviceFCMToken: reqBody.deviceFCMToken,
    }, userId);
    return ResponseUtil.handleResponse(
      data,
      'Driver dashboard data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Put('set-driver-type')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Driver dashboard' })
  @ApiResponse({ status: 200, description: 'Driver dashboard data' })
  async setDriverType(
    @Body() reqBody: { isPeppcruiseDriver: boolean },
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.setDriverType(userId, reqBody.isPeppcruiseDriver);
    return ResponseUtil.handleResponse(
      {},
      'Request successfull',
      HttpStatus.OK,
    );
  } 

  @Get('bank-list')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Get list of banks' })
  @ApiResponse({ status: 200, description: 'Banks retrieved successfully' })
  async getBankAccountList(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const data = await monifyAPI.fetchBanks();
    return ResponseUtil.handleResponse(
      data,
      'Banks retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post('bank-account-validation')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Validate bank account' })
  @ApiResponse({ status: 200, description: 'Bank account validated successfully' })
  async validateBankAccount(
    @Body() reqBody: ValidateBankAccountDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const data = await monifyAPI.validateAccount({ bankCode: reqBody.bankCode, accountNumber: reqBody.accountNo });
    return ResponseUtil.handleResponse(
      data,
      'Bank account validated successfully',
      HttpStatus.OK,
    );
  }

  @Put('bank-account-info')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Update bank account' })
  @ApiResponse({ status: 200, description: 'Update bank account ' })
  async createBankAccount(
    @Body() reqBody: UpdateBankAccountDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.updateBankAccount(userId, reqBody);
    return ResponseUtil.handleResponse(
      data,
      'Bank account updated successfully',
      HttpStatus.OK,
    );
  }

  @Put('license')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Update drivers license' })
  @ApiResponse({ status: 200, description: 'Driver license updated' })
  async driverLicense(
    @Body() reqBody: AddDriverLicenseDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ){
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.driverService.addDriverLicense(userId, reqBody);
    return ResponseUtil.handleResponse(
      data,
      'Driver license updated',
      HttpStatus.OK,
    );
  }

}

