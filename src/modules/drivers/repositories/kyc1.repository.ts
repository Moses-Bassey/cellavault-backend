import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';

@Injectable()
export class Kyc1Repository {
  constructor(
    @InjectModel(kyc1PersonalInfo)
    private kyc1Model: typeof kyc1PersonalInfo,
  ) {}

  async findById(id: string): Promise<kyc1PersonalInfo | null> {
    return await this.kyc1Model.findByPk(id, { raw: true });
  }

  async findByDriverId(driverId: string): Promise<kyc1PersonalInfo | null> {
    return await this.kyc1Model.findOne({
      where: { driverId },
      raw: true,
    });
  }

  async create(kycData: Partial<kyc1PersonalInfo>): Promise<kyc1PersonalInfo> {
    const kyc = await this.kyc1Model.create(kycData as any, {
      raw: true,
      returning: true,
    });
    return kyc.toJSON() as kyc1PersonalInfo;
  }

  async update(
    id: string,
    kycData: Partial<kyc1PersonalInfo>,
  ): Promise<[number, kyc1PersonalInfo[]]> {
    return await this.kyc1Model.update(kycData, {
      where: { id },
      returning: true,
    });
  }

  async updateByDriverId(
    driverId: string,
    kycData: Partial<kyc1PersonalInfo>,
  ): Promise<[number, kyc1PersonalInfo[]]> {
    return await this.kyc1Model.update(kycData, {
      where: { driverId },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.kyc1Model.destroy({
      where: { id },
    });
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.kyc1Model.destroy({
      where: { driverId },
    });
  }
}
