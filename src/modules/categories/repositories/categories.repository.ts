import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Categories } from '../entities/categories.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Categories)
    private readonly categoriesModel: typeof Categories,
  ) {}

  async create(data: Partial<Categories>): Promise<Categories> {
    return this.categoriesModel.create(data as any);
  }

  async findAll(): Promise<Categories[]> {
    return this.categoriesModel.findAll();
  }

  async findById(id: string): Promise<Categories | null> {
    return this.categoriesModel.findByPk(id);
  }

  async update(id: string, data: Partial<Categories>): Promise<Categories | null> {
    await this.categoriesModel.update(data, {
      where: { id },
      returning: true,
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.categoriesModel.destroy({
      where: { id },
    });
  }

  async findByIdWithDeleted(id: string): Promise<Categories | null> {
    return this.categoriesModel.findByPk(id, {
      paranoid: false, // Disables automatic "deletedAt IS NULL" filtering
    });
  }

  async restore(id: string): Promise<void> {
    await this.categoriesModel.restore({
      where: { id },
    });
  }
}