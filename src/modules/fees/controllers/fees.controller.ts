import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtAuthPayload } from '../../auth/auth.interface';
import { FeesService } from '../services/fees.service';
import { CreateFeeDto, UpdateFeeDto, FeeQueryDto } from '../dto/fees.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { ResponseUtil } from 'src/utils/response.utils';
import { UuidValidationPipe } from '../../../shared/pipes/uuid.validator.pipe';

@ApiTags('Fees')
@ApiBearerAuth()
@Roles(UserType.SUPER_ADMIN, UserType.PEPP_ADMIN, UserType.PEPP_MANAGER)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/fees')
export class FeesController {
  constructor(
    private readonly feeService: FeesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a fee' })
  @ApiResponse({
    status: 201,
    description: 'Fee created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid fee data' })
  async createFee(
    @Body() dto: CreateFeeDto,
  ) {
    const data = await this.feeService.createFee(
      dto,
    );
    return ResponseUtil.handleResponse(
      data,
      'Fee created successfully',
      HttpStatus.CREATED,
    );
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all fees' })
  @ApiResponse({
    status: 200,
    description: 'Fees retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Fees not found' })
  async getFees(
    @Query() query: FeeQueryDto,
  ) {
    const data = await this.feeService.getFees(
      query,
    );
    return ResponseUtil.handleResponse(
      data,
      'Fees retrieved successfully',
      HttpStatus.OK
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fee by id' })
  @ApiResponse({
    status: 200,
    description: 'Fee retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Fee not found' })
  async getFee(
    @Param('id', UuidValidationPipe) feeId: string,
  ) {
    const data = await this.feeService.getFee(feeId);
    return ResponseUtil.handleResponse(
      data,
      'Fee details retrieved sucessfully',
      HttpStatus.OK,
    )
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update fee by id' })
  @ApiResponse({
    status: 200,
    description: 'Fee updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Fee not found' })
  async updateFee(
    @Param('id', UuidValidationPipe) feeId: string,
    @Body() dto: UpdateFeeDto,
  ) {
    const data = await this.feeService.updateFee(
      feeId,
      dto,
    );
    return ResponseUtil.handleResponse(
      data,
      'Fee updated successfully',
      HttpStatus.OK,
    );
  }
}