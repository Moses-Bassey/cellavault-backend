import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { CngConversion } from '../entities/cng-conversion.entity';
import { CNG_CONVERSION_STATUS } from 'src/enums/cng-conversion-status.enum';

@Injectable()
export class CngConversionRepository {
  constructor(
    @InjectModel(CngConversion)
    private cngConversionModel: typeof CngConversion,
  ) {}

  async count(options?: any): Promise<number> {
    const count = await this.cngConversionModel.count(options);
    return typeof count === 'number' ? count : (count as any).length || 0;
  }

  async findById(id: string): Promise<CngConversion | null> {
    return await this.cngConversionModel.findByPk(id, { raw: true });
  }

  async findAll(options?: any): Promise<CngConversion[]> {
    return await this.cngConversionModel.findAll(options);
  }

  async create(
    cngConversionData: Partial<CngConversion>,
  ): Promise<CngConversion> {
    const cngConversion = await this.cngConversionModel.create(
      cngConversionData as any,
      { raw: true, returning: true },
    );
    return cngConversion.toJSON() as CngConversion;
  }

  async update(
    id: string,
    cngConversionData: Partial<CngConversion>,
  ): Promise<[number, CngConversion[]]> {
    return await this.cngConversionModel.update(cngConversionData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.cngConversionModel.destroy({
      where: { id },
    });
  }
}
