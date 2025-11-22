import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, HttpStatus, Delete} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorService } from '../services/guarantor.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';
import { JwtAuthPayload } from 'src/modules/auth/auth.interface';
import { Validators } from 'src/utils/validators.utils';
import type { Request as ExpressRequest } from 'express';
import { CreateGuarantorDto } from '../dto/guarantor.dto';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('Guarantors')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('drivers/guarantors')
export class GuarantorController {
  constructor(private readonly guarantorService: GuarantorService) {}

  @Post()
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Add a guarantor to a driver' })
  @ApiResponse({ status: 201, description: 'Guarantor added successfully' })
  @ApiResponse({ status: 400, description: 'Maximum guarantors reached (max 3)' })
  async create(
    @Param('driverId') driverId: string,
    @Body() guarantorData: CreateGuarantorDto,
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.guarantorService.create(userId, guarantorData);
    return ResponseUtil.handleResponse(data, 'Guarantor added successfully', HttpStatus.CREATED);
  }

  @Get()
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Get all guarantors for a driver' })
  @ApiResponse({ status: 200, description: 'Guarantors retrieved successfully' })
  async findByDriverId(@Request() req: ExpressRequest & { user: JwtAuthPayload },
  ) {
    const userId = Validators.validateUuid(req.user.userId);
    const data = await this.guarantorService.findByDriverId(userId);
    return ResponseUtil.handleResponse(data, 'Guarantors retrieved successfully', HttpStatus.OK);
  }

  @Delete(':id')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Get all guarantors for a driver' })
  @ApiResponse({ status: 200, description: 'Guarantors retrieved successfully' })
  async deleteGuarantor(
    @Request() req: ExpressRequest & { user: JwtAuthPayload },
    @Param('id') id: string
  ) {
    const driverId = Validators.validateUuid(req.user.userId);
    const guarantorId = Validators.validateUuid(id);
    const data = await this.guarantorService.deleteGuarantor(guarantorId, driverId);
    return ResponseUtil.handleResponse(data, 'Guarantor deleted successfully', HttpStatus.OK);
  }

}

