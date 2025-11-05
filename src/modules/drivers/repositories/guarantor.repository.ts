import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Guarantor } from '../entities/guarantor.entity';

@Injectable()
export class GuarantorRepository {
  constructor(
    @InjectModel(Guarantor)
    private guarantorModel: typeof Guarantor,
  ) {}

  async findById(id: string): Promise<Guarantor | null> {
    return await this.guarantorModel.findByPk(id, {raw: true});
  }

  async findByDriverId(driverId: string): Promise<Guarantor[]> {
    return await this.guarantorModel.findAll({
      where: { driverId },
      raw: true
    });
  }

  async countByDriverId(driverId: string): Promise<number> {
    return await this.guarantorModel.count({
      where: { driverId }
    });
  }

  async create(guarantorData: Partial<Guarantor>): Promise<Guarantor> {
    const guarantor =  await this.guarantorModel.create(guarantorData as any, {raw: true, returning: true});
    return guarantor.toJSON() as Guarantor
  }

  async update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]> {
    return await this.guarantorModel.update(guarantorData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.guarantorModel.destroy({
      where: { id },
    });
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.guarantorModel.destroy({
      where: { driverId },
    });
  }
}

