import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CategoriesDto } from '../dto/categories.dto';
import { UpdateCategoriesDto } from '../dto/updateCategories.dto';
import { Categories } from '../entities/categories.entity';
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserType } from 'src/enums';
import { ResponseUtil } from 'src/utils/response.utils';


@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.ADMIN)
    @Post()
    async create(@Body() createCategoryDto: CategoriesDto) {
        const data = await this.categoriesService.create(createCategoryDto);
        return ResponseUtil.handleResponse(data, 'Category created successfully', HttpStatus.OK);
    }

    //@UseGuards(AuthGuard)
    @Get()
    async findAll() {
        const data = await this.categoriesService.getAllCategories();
        return ResponseUtil.handleResponse(data, 'Categories retrieved successfully', HttpStatus.OK);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.categoriesService.getCategoryById(id);
        return ResponseUtil.handleResponse(data, 'Category returned successfully', HttpStatus.OK)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.ADMIN)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCategoriesDto: UpdateCategoriesDto,
    ) {
        const data = await this.categoriesService.update(id, updateCategoriesDto);
        return ResponseUtil.handleResponse(data, 'Category updated successfully', HttpStatus.OK)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        const data = await this.categoriesService.delete(id);
        return ResponseUtil.handleResponse(data, 'Category deleted successfully', HttpStatus.OK)
    }

    @Patch(':id/restore')
    async restore(@Param('id') id: string) {
        const data = await this.categoriesService.restoreCategory(id);
        return ResponseUtil.handleResponse(
            data,
            'Category restored successfully',
            HttpStatus.OK,
        );
    }
}