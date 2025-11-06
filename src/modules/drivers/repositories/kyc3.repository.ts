import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';

@Injectable()
export class Kyc3Repository {
  constructor(
    @InjectModel(kyc3ResidentialInformation)
    private kyc3Model: typeof kyc3ResidentialInformation,
  ) {}

  async findById(
    id: string,
  ): Promise<kyc3ResidentialInformation | null> {
    return await this.kyc3Model.findByPk(id, { raw: true });
  }

  async findByDriverId(
    driverId: string,
  ): Promise<kyc3ResidentialInformation | null> {
    return await this.kyc3Model.findOne({
      where: { driverId },
      raw: true,
    });
  }

  async create(
    kycData: Partial<kyc3ResidentialInformation>,
  ): Promise<kyc3ResidentialInformation> {
    const kyc = await this.kyc3Model.create(kycData as any, {
      raw: true,
      returning: true,
    });
    return kyc.toJSON() as kyc3ResidentialInformation;
  }

  async update(
    id: string,
    kycData: Partial<kyc3ResidentialInformation>,
  ): Promise<[number, kyc3ResidentialInformation[]]> {
    return await this.kyc3Model.update(kycData, {
      where: { id },
      returning: true,
    });
  }

  async updateByDriverId(
    driverId: string,
    kycData: Partial<kyc3ResidentialInformation>,
  ): Promise<[number, kyc3ResidentialInformation[]]> {
    return await this.kyc3Model.update(kycData, {
      where: { driverId },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.kyc3Model.destroy({
      where: { id },
    });
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.kyc3Model.destroy({
      where: { driverId },
    });
  }
}

