import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountryRepository {
  constructor(
    @InjectModel(Country)
    private countryModel: typeof Country,
  ) {}

  async findById(id: string): Promise<Country | null> {
    return await this.countryModel.findByPk(id);
  }

  async findByName(name: string): Promise<Country | null> {
    return await this.countryModel.findOne({
      where: { name },
    });
  }

  async findAll(options?: any): Promise<Country[]> {
    return await this.countryModel.findAll(options);
  }

  async create(countryData: Partial<Country>): Promise<Country> {
    return await this.countryModel.create(countryData as any);
  }

  async update(id: string, countryData: Partial<Country>): Promise<[number, Country[]]> {
    return await this.countryModel.update(countryData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.countryModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    await this.countryModel.restore({
      where: { id },
    });
  }
}
