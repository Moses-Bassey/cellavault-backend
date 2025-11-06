import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KycService } from '../services/kyc.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { CreateKyc1Dto, CreateKyc2Dto, CreateKyc3Dto } from '../dto/kyc.dto';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { Request as ExpressRequest } from 'express';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('KYC')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('driver/kyc')
export class KycController {
  
  constructor(private readonly kycService: KycService) {}

  @Get()
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all KYC by driver' })
  @ApiResponse({
    status: 200,
    description: 'All KYC retrieved successfully',
  })
  async getAllKycByDriver(
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ){
    const data = await this.kycService.getAllKycByDriverId(req.user.userId);
    return ResponseUtil.success(data, 'All KYC retrieved successfully', HttpStatus.OK);
  }

  @Post('personal-info')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Create or update KYC1 personal information' })
  @ApiResponse({
    status: 201,
    description: 'KYC1 personal information created/updated successfully',
  })
  async createKyc1(
    @Body() kycData: CreateKyc1Dto,
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ) {
    const data = await this.kycService.createKyc1(req.user.userId, kycData);
    return ResponseUtil.success(data, 'KYC1 personal information created successfully', HttpStatus.CREATED);
  }

  @Get('personal-info')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get KYC1 personal information by driver ID' })
  @ApiResponse({
    status: 200,
    description: 'KYC1 personal information retrieved successfully',
  })
  async getKyc1PersonalInfo(@Req() req: ExpressRequest & { user: JwtAuthPayload }){
    const data = await this.kycService.fetchKyc1ByDriverId(req.user.userId);
    return ResponseUtil.success(data, 'KYC1 personal information retrieved successfully', HttpStatus.OK);
  }

  @Post('id-information')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Create or update KYC2 id information' })
  @ApiResponse({
    status: 201,
    description: 'KYC2 id information created successfully',
  })
  async createKyc2IdInformation(
    @Body() kycData: CreateKyc2Dto,
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ) {
    const data = await this.kycService.createKyc2(req.user.userId, kycData);
    return ResponseUtil.success(data, 'KYC2 information created successfully', HttpStatus.CREATED);
  }

  @Get('id-information')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get KYC2 id information by driver' })
  @ApiResponse({
    status: 200,
    description: 'KYC2 id information retrieved successfully',
  })
  async getKyc2IdInformation(
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ){
    const data = await this.kycService.fetchKyc2ByDriverId(req.user.userId);
    return ResponseUtil.success(data, 'KYC2 information retrieved successfully', HttpStatus.OK);
  }

  @Post('id-information')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Create or update KYC1 personal information' })
  @ApiResponse({
    status: 201,
    description: 'KYC2 information created successfully',
  })
  async createKyc3AddressInformation(
    @Body() kycData: CreateKyc3Dto,
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ) {
    const data = await this.kycService.createKyc3(req.user.userId, kycData);
    return ResponseUtil.success(data, 'KYC2 information created successfully', HttpStatus.CREATED);
  }

  @Get('address-information')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get KYC3 address information by driver' })
  @ApiResponse({
    status: 200,
    description: 'KYC3 address information retrieved successfully',
  })
  async getKyc3AddressInformation(
    @Req() req: ExpressRequest & { user: JwtAuthPayload }
  ){
    const data = await this.kycService.fetchKyc3ByDriverId(req.user.userId);
    return ResponseUtil.success(data, 'KYC3 address information retrieved successfully', HttpStatus.OK);
  }
 
}

