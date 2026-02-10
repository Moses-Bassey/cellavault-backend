import { HttpStatus, Injectable } from '@nestjs/common';
import { LGA } from '../entities/lga.entity';
import { LgaRepository } from '../repositories/lga.repository';

@Injectable()
export class LgaService {
  constructor(private readonly lgaRepository: LgaRepository) {}

  async findById(id: string): Promise<LGA | null> {
    return await this.lgaRepository.findById(id);
  }

  async findByStateId(stateId: string): Promise<LGA[]> {
    const lgas = await this.lgaRepository.findByStateId(stateId);
    return lgas;
  }

  async findAll(options?: any) {
    const lgas = await this.lgaRepository.findAll(options);
    return lgas;
  }

  async create(lgaData: Partial<LGA>): Promise<LGA> {
    return await this.lgaRepository.create(lgaData);
  }

  async update(id: string, lgaData: Partial<LGA>): Promise<[number, LGA[]]> {
    return await this.lgaRepository.update(id, lgaData);
  }

  async delete(id: string): Promise<number> {
    return await this.lgaRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    return await this.lgaRepository.restore(id);
  }
}
