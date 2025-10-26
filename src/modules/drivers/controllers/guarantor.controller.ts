import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorService } from '../services/guarantor.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';

@ApiTags('Guarantors')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('guarantors')
export class GuarantorController {
  constructor(private readonly guarantorService: GuarantorService) {}

  @Post(':driverId')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Add a guarantor to a driver' })
  @ApiResponse({ status: 201, description: 'Guarantor added successfully' })
  @ApiResponse({ status: 400, description: 'Maximum guarantors reached (max 3)' })
  async create(
    @Param('driverId') driverId: string,
    @Body() guarantorData: Partial<Guarantor>,
  ): Promise<Guarantor> {
    return await this.guarantorService.create(driverId, guarantorData);
  }

  @Get('driver/:driverId')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all guarantors for a driver' })
  @ApiResponse({ status: 200, description: 'Guarantors retrieved successfully' })
  async findByDriverId(@Param('driverId') driverId: string): Promise<Guarantor[]> {
    return await this.guarantorService.findByDriverId(driverId);
  }

  @Get(':id')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get guarantor by ID' })
  @ApiResponse({ status: 200, description: 'Guarantor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Guarantor not found' })
  async findById(@Param('id') id: string): Promise<Guarantor | null> {
    return await this.guarantorService.findById(id);
  }

  @Put(':id')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update guarantor' })
  @ApiResponse({ status: 200, description: 'Guarantor updated successfully' })
  @ApiResponse({ status: 404, description: 'Guarantor not found' })
  async update(
    @Param('id') id: string,
    @Body() guarantorData: Partial<Guarantor>,
  ): Promise<[number, Guarantor[]]> {
    return await this.guarantorService.update(id, guarantorData);
  }

  @Delete(':id')
  @Roles(UserType.DRIVER, UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete guarantor' })
  @ApiResponse({ status: 200, description: 'Guarantor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Guarantor not found' })
  async delete(@Param('id') id: string): Promise<number> {
    return await this.guarantorService.delete(id);
  }

  @Put(':id/verify')
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify guarantor' })
  @ApiResponse({ status: 200, description: 'Guarantor verified successfully' })
  async verify(@Param('id') id: string): Promise<[number, Guarantor[]]> {
    return await this.guarantorService.verify(id);
  }
}

