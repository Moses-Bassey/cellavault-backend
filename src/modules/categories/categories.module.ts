import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Categories } from './entities/categories.entity';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';

@Module({
  imports: [SequelizeModule.forFeature([Categories])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoriesRepository, ],
})
export class CategoriesModule {}