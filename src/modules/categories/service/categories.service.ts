import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { Categories } from '../entities/categories.entity';
import { UpdateCategoriesDto } from '../dto/updateCategories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) { }

  async create(dto: any): Promise<Categories> {
    return this.categoriesRepository.create(dto);
  }

  async getAllCategories(): Promise<Categories[]> {
    return this.categoriesRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Categories> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoriesDto): Promise<Categories> {
    await this.getCategoryById(id); // Ensures category exists before updating
    const updated = await this.categoriesRepository.update(id, dto);
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async delete(id: string): Promise<Categories> {
    await this.getCategoryById(id); // ensures it exists
    await this.categoriesRepository.delete(id);
    const deleted = await this.categoriesRepository.findByIdWithDeleted(id);
    if (!deleted) throw new NotFoundException('Category not found');
    return deleted;

  }

  async restoreCategory(id: string): Promise<Categories> {

    const category = await this.categoriesRepository.findByIdWithDeleted(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!category.deletedAt) {
      throw new BadRequestException('Category is not deleted');
    }

    await this.categoriesRepository.restore(id);

    return category;
  }
}