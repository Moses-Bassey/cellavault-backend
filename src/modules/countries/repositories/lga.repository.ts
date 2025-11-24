import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { LGA } from '../entities/lga.entity';

@Injectable()
export class LgaRepository {
  constructor(
    @InjectModel(LGA)
    private lgaModel: typeof LGA,
  ) {}

  async findById(id: string): Promise<LGA | null> {
    return await this.lgaModel.findByPk(id);
  }

  async findByStateId(stateId: string): Promise<LGA[]> {
    return await this.lgaModel.findAll({
      where: { stateId },
      order: [['name', 'ASC']],
    });
  }

  async findAll(options?: any): Promise<LGA[]> {
    return await this.lgaModel.findAll(options);
  }

  async create(lgaData: Partial<LGA>): Promise<LGA> {
    return await this.lgaModel.create(lgaData as any);
  }

  async update(id: string, lgaData: Partial<LGA>): Promise<[number, LGA[]]> {
    return await this.lgaModel.update(lgaData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.lgaModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    return await this.lgaModel.restore({
      where: { id },
    });
  }
}

