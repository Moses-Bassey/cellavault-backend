import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from '../service/product.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from '../dto/product.dto';
import { ResponseUtil } from '../../../utils/response.utils'; // Adjust import path as needed

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);
    return ResponseUtil.handleResponse(
      data,
      'Product created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll(@Query() queryDto: QueryProductDto) {
    const data = await this.productsService.findAll(queryDto);
    return ResponseUtil.handleResponse(
      data,
      'Products retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productsService.findOne(id);
    return ResponseUtil.handleResponse(
      data,
      'Product retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productsService.update(id, updateProductDto);
    return ResponseUtil.handleResponse(
      data,
      'Product updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productsService.remove(id);
    return ResponseUtil.handleResponse(
      data,
      'Product deleted successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id/restore')
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productsService.restore(id);
    return ResponseUtil.handleResponse(
      data,
      'Product restored successfully',
      HttpStatus.OK,
    );
  }
}