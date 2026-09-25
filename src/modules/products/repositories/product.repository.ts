import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entities';
import { Categories } from '../../categories/entities/categories.entity';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from '../dto/product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.productModel.create(createProductDto as any);
    }

    // products.repository.ts

    async findAll(queryDto: QueryProductDto) {
        const { page = 1, limit = 10, search, categoryId } = queryDto;
        const offset = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const { rows, count } = await this.productModel.findAndCountAll({
            where,
            include: [{ model: Categories, attributes: ['name'] }],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        // Map and flatten the response here
        const formattedProducts = rows.map((product) => {
            const { categories, ...productData } = product.toJSON() as any;

            return {
                ...productData,
                categoryName: categories?.name || null,
            };
        });

        return {
            items: formattedProducts,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    async findById(id: string, includeDeleted = false): Promise<Product | null> {
        return this.productModel.findByPk(id, {
            include: [{ model: Categories, attributes: ['id', 'name'] }],
            paranoid: !includeDeleted,
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<[number, Product[]]> {
        return this.productModel.update(updateProductDto, {
            where: { id },
            returning: true,
        });
    }

    // product.repository.ts
    async softDelete(id: string): Promise<Product | null> {
        const product = await this.productModel.findByPk(id, { paranoid: false });

        if (!product) {
            return null;
        }

        // Set deletedAt manually so the instance returns with the timestamp
        await product.update({ deletedAt: new Date() });

        return product;
    }

    async restore(id: string): Promise<void> {
        const product = await this.productModel.findByPk(id, { paranoid: false });
        if (product) {
            await product.restore();
        }
    }
}