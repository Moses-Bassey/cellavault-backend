import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';

@Injectable()
export class Kyc2Repository {
  constructor(
    @InjectModel(kyc2IdInformation)
    private kyc2Model: typeof kyc2IdInformation,
  ) {}

  async findById(id: string): Promise<kyc2IdInformation | null> {
    return await this.kyc2Model.findByPk(id, { raw: true });
  }

  async findByDriverId(driverId: string): Promise<kyc2IdInformation | null> {
    return await this.kyc2Model.findOne({
      where: { driverId },
      raw: true,
    });
  }

  async create(
    kycData: Partial<kyc2IdInformation>,
  ): Promise<kyc2IdInformation> {
    const kyc = await this.kyc2Model.create(kycData as any, {
      raw: true,
      returning: true,
    });
    return kyc.toJSON() as kyc2IdInformation;
  }

  async update(
    id: string,
    kycData: Partial<kyc2IdInformation>,
  ): Promise<[number, kyc2IdInformation[]]> {
    return await this.kyc2Model.update(kycData, {
      where: { id },
      returning: true,
    });
  }

  async updateByDriverId(
    driverId: string,
    kycData: Partial<kyc2IdInformation>,
  ): Promise<[number, kyc2IdInformation[]]> {
    return await this.kyc2Model.update(kycData, {
      where: { driverId },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.kyc2Model.destroy({
      where: { id },
    });
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.kyc2Model.destroy({
      where: { driverId },
    });
  }
}
