import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entities';
import { ProductsController } from './controller/product.controller';
import { ProductsService } from './service/product.service';
import { ProductsRepository } from './repositories/product.repository';
import { CategoriesService } from '../categories/service/categories.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    imports: [SequelizeModule.forFeature([Product]), CategoriesModule ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository, CategoriesService],
    exports: [SequelizeModule, ProductsService],
})
export class ProductsModule { }