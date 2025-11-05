import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { State } from '../entities/state.entity';

@Injectable()
export class StateRepository {
  constructor(
    @InjectModel(State)
    private stateModel: typeof State,
  ) {}

  async findById(id: string): Promise<State | null> {
    return await this.stateModel.findByPk(id);
  }

  async findByCountryId(countryId: string): Promise<State[]> {
    return await this.stateModel.findAll({
      where: { countryId },
      order: [['name', 'ASC']],
    });
  }

  async findAll(options?: any): Promise<State[]> {
    return await this.stateModel.findAll(options);
  }

  async create(stateData: Partial<State>): Promise<State> {
    return await this.stateModel.create(stateData as any);
  }

  async update(id: string, stateData: Partial<State>): Promise<[number, State[]]> {
    return await this.stateModel.update(stateData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.stateModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    await this.stateModel.restore({
      where: { id },
    });
  }
}

