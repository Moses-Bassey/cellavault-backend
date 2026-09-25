import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from '../dto/product.dto';
import { CategoriesService } from 'src/modules/categories/service/categories.service';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository,
        private readonly categoriesService: CategoriesService
    ) { }

    // products.service.ts
    async create(createProductDto: CreateProductDto) {
        const category = await this.categoriesService.getCategoryById(createProductDto.categoryId);
        if (!category) {
            throw new NotFoundException(`Category with ID "${createProductDto.categoryId}" not found`);
        }
        return this.productsRepository.create(createProductDto);
    }

    async findAll(queryDto: QueryProductDto) {
        return this.productsRepository.findAll(queryDto);
    }

    async findOne(id: string) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        await this.findOne(id); // Ensure product exists
        const [, updatedProducts] = await this.productsRepository.update(id, updateProductDto);
        return updatedProducts[0];
    }

    // product.service.ts
    async remove(id: string) {
        const deletedProduct = await this.productsRepository.softDelete(id);

        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        return deletedProduct;
    }

    async restore(id: string) {
        const product = await this.productsRepository.findById(id, true);
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        await this.productsRepository.restore(id);
        return { message: `Product with ID "${id}" restored successfully` };
    }
}