import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Country } from '../entities/country.entity';
import { CountryService } from '../services/country.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserType } from '../../../enums/user-type.enum';


@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'Countries retrieved successfully' })
  async findAll() {
    const data = await this.countryService.findAll();
    return data;
  }

  @Get(':id')
  @Roles(UserType.PEPP_ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiResponse({ status: 200, description: 'Country retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async findById(@Param('id') id: string): Promise<Country | null> {
    return await this.countryService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new country' })
  @ApiResponse({ status: 201, description: 'Country created successfully' })
  async create(@Body() countryData: Partial<Country>): Promise<Country> {
    return await this.countryService.create(countryData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({ status: 200, description: 'Country updated successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async update(
    @Param('id') id: string,
    @Body() countryData: Partial<Country>,
  ): Promise<[number, Country[]]> {
    return await this.countryService.update(id, countryData);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete country' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async delete(@Param('id') id: string): Promise<number> {
    return await this.countryService.delete(id);
  }
}
