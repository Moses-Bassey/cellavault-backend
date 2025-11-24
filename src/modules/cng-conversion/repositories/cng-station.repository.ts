import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { CngStation } from '../entities/cng-station.entity';

@Injectable()
export class CngStationRepository {
  constructor(
    @InjectModel(CngStation)
    private cngStationModel: typeof CngStation,
  ) {}

  async findAll(options?: any): Promise<CngStation[]> {
    return await this.cngStationModel.findAll(options);
  }

  async create(cngStationData: Partial<CngStation>): Promise<CngStation> {
    const cngStation = await this.cngStationModel.create(cngStationData as any, {raw: true, returning: true});
    return cngStation.toJSON() as CngStation;
  }
}

