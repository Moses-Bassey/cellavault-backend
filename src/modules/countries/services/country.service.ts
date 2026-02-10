import { HttpStatus, Injectable } from '@nestjs/common';
import { Country } from '../entities/country.entity';
import { CountryRepository } from '../repositories/country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findById(id: string): Promise<Country | null> {
    return await this.countryRepository.findById(id);
  }

  async findByName(name: string): Promise<Country | null> {
    return await this.countryRepository.findByName(name);
  }

  async findAll(options?: any) {
    const countries = await this.countryRepository.findAll(options);
    return countries;
  }

  async create(countryData: Partial<Country>): Promise<Country> {
    return await this.countryRepository.create(countryData);
  }

  async update(
    id: string,
    countryData: Partial<Country>,
  ): Promise<[number, Country[]]> {
    return await this.countryRepository.update(id, countryData);
  }

  async delete(id: string): Promise<number> {
    return await this.countryRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.countryRepository.restore(id);
  }
}
