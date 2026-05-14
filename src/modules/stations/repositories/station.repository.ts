import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Op,
  WhereOptions,
  fn,
  col,
  literal,
  ModelStatic as SequelizeModelStatic,
} from 'sequelize';
import { Model } from 'sequelize-typescript';

import { CngStation } from '../entities/cng-station.entity';
import { CngFuelingStation } from '../entities/cng-fueling-station.entity';
import { ChargingStation } from '../entities/charging-station.entity';
import { StationSource } from '../dto/station.dto';
import { StationCursor } from '../utils/station-cursor.util';

type AnyStation = Record<string, any>;

type StationRowCount = {
  total: string | number;
  active: string | number;
  inactive: string | number;
};

export type StationEntity = CngStation | CngFuelingStation | ChargingStation;

// base static model type for safe calls (prevents “this context” overload union issues)
type BaseModelStatic = SequelizeModelStatic<Model<any, any>>;

@Injectable()
export class StationRepository {
  constructor(
    @InjectModel(CngStation)
    private readonly cngStationModel: typeof CngStation,

    @InjectModel(CngFuelingStation)
    private readonly cngFuelingModel: typeof CngFuelingStation,

    @InjectModel(ChargingStation)
    private readonly chargingModel: typeof ChargingStation,
  ) {}

  /* ---------------------------- Summary Counts ---------------------------- */

  async getSummary(): Promise<{
    totalStations: number;
    activeStations: number;
    inactiveStations: number;
    cngStations: number;
    evChargingStations: number;
  }> {
    const [cng, fueling, ev] = await Promise.all([
      this.countTable(this.cngStationModel as unknown as BaseModelStatic),
      this.countTable(this.cngFuelingModel as unknown as BaseModelStatic),
      this.countTable(this.chargingModel as unknown as BaseModelStatic),
    ]);

    const totalStations = cng.total + fueling.total + ev.total;
    const activeStations = cng.active + fueling.active + ev.active;
    const inactiveStations = cng.inactive + fueling.inactive + ev.inactive;

    return {
      totalStations,
      activeStations,
      inactiveStations,
      cngStations: cng.total + fueling.total,
      evChargingStations: ev.total,
    };
  }

  private async countTable(
    model: BaseModelStatic,
  ): Promise<{ total: number; active: number; inactive: number }> {
    const row = (await model.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'total'],
        [
          fn('SUM', literal(`CASE WHEN isActive = 1 THEN 1 ELSE 0 END`)),
          'active',
        ],
        [
          fn('SUM', literal(`CASE WHEN isActive = 0 THEN 1 ELSE 0 END`)),
          'inactive',
        ],
      ],
      raw: true,
    })) as unknown as StationRowCount | null;

    return {
      total: Number(row?.total ?? 0),
      active: Number(row?.active ?? 0),
      inactive: Number(row?.inactive ?? 0),
    };
  }

  /* ----------------------------- List helpers ----------------------------- */

  async fetchBatch(params: {
    source: StationSource;
    limit: number;
    search?: string;
    isActive?: boolean;
    badge?: string;
    cursor?: StationCursor;
  }): Promise<{
    items: AnyStation[];
    total: number;
    nextCursor: string | null;
  }> {
    const { source, limit, search, isActive, badge, cursor } = params;

    const model = this.getModel(source);

    const q = search?.trim()
      ? `%${search.trim()}%`
      : undefined;

    const where: WhereOptions = {
      ...(typeof isActive === 'boolean'
        ? { isActive }
        : {}),

      ...(badge
        ? { stationBadge: badge }
        : {}),

      ...(q
        ? {
            [Op.or]: [
              { name: { [Op.like]: q } },
              { address: { [Op.like]: q } },
              { state: { [Op.like]: q } },
              { country: { [Op.like]: q } },
            ],
          }
        : {}),

      ...(cursor
        ? {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    updatedAt: {
                      [Op.lt]: new Date(cursor.updatedAt),
                    },
                  },
                  {
                    updatedAt: new Date(cursor.updatedAt),
                    id: { [Op.lt]: cursor.id },
                  },
                ],
              },
            ],
          }
        : {}),
    } as any;

    const { rows, count } = await model.findAndCountAll({
      where,

      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],

      limit,

      attributes: [
        'id',
        'name',
        'state',
        'country',
        'address',
        'isActive',
        'stationBadge',
        'updatedAt',
      ],

      raw: true,
    });

    const last = rows[rows.length - 1];

    const nextCursor =
      rows.length === limit && last
        ? Buffer.from(
            JSON.stringify({
              updatedAt: last.updatedAt,
              id: last.id,
            }),
          ).toString('base64')
        : null;

    return {
      items: (rows as any[]).map((r) => ({
        ...r,
        __source: source,
      })),

      total: count,

      nextCursor,
    };
  }

  /* ----------------------------- Create station ----------------------------- */

  async createStation(source: StationSource, payload: Record<string, any>) {
    switch (source) {
      case 'CNG':
        return this.cngStationModel.create(payload as any);
      case 'CNG_CONVERSION':
        return this.cngFuelingModel.create(payload as any);
      case 'EV_CHARGING':
        return this.chargingModel.create(payload as any);
      default:
        throw new Error('Invalid station type');
    }
  }

  /* ----------------------------- Get by id ----------------------------- */

  async findById(
    source: StationSource,
    id: string,
  ): Promise<StationEntity | null> {
    // return typed instances, not Model<any,any>
    switch (source) {
      case 'CNG_CONVERSION':
        return this.cngStationModel.findByPk(id);
      case 'CNG':
        return this.cngFuelingModel.findByPk(id);
      case 'EV_CHARGING':
        return this.chargingModel.findByPk(id);
      default:
        return null;
    }
  }

  /* ----------------------------- Update station ----------------------------- */

  async updateStation(
    source: StationSource,
    id: string,
    patch: Record<string, unknown>,
  ): Promise<StationEntity | null> {
    switch (source) {
      case 'CNG_CONVERSION': {
        const [affected] = await this.cngStationModel.update(patch as any, {
          where: { id },
        });
        if (!affected) return null;
        return this.cngStationModel.findByPk(id);
      }

      case 'CNG': {
        const [affected] = await this.cngFuelingModel.update(patch as any, {
          where: { id },
        });
        if (!affected) return null;
        return this.cngFuelingModel.findByPk(id);
      }

      case 'EV_CHARGING': {
        const [affected] = await this.chargingModel.update(patch as any, {
          where: { id },
        });
        if (!affected) return null;
        return this.chargingModel.findByPk(id);
      }

      default:
        return null;
    }
  }

  /* ----------------------------- Helpers ----------------------------- */

  /**
   * Base model for generic querying (findAll)
   */
  private getModel(source: StationSource): BaseModelStatic {
    switch (source) {
      case 'CNG_CONVERSION':
        return this.cngStationModel as unknown as BaseModelStatic;
      case 'CNG':
        return this.cngFuelingModel as unknown as BaseModelStatic;
      case 'EV_CHARGING':
        return this.chargingModel as unknown as BaseModelStatic;
      default:
        return this.cngStationModel as unknown as BaseModelStatic;
    }
  }

  /**
   * Typed model for operations that should return typed entity instances.
   * This avoids Model<any,any> leaking into service.
   */
  private getTypedModel(
    source: StationSource,
  ): typeof CngStation | typeof CngFuelingStation | typeof ChargingStation {
    switch (source) {
      case 'CNG_CONVERSION':
        return this.cngStationModel;
      case 'CNG':
        return this.cngFuelingModel;
      case 'EV_CHARGING':
        return this.chargingModel;
      default:
        return this.cngStationModel;
    }
  }

  async existsByNameAndAddress(
    source: StationSource,
    name: string,
    address: string,
  ): Promise<boolean> {
    switch (source) {
      case 'CNG_CONVERSION':
        return (
          (await this.cngStationModel.count({ where: { name, address } })) > 0
        );
      case 'CNG':
        return (
          (await this.cngFuelingModel.count({ where: { name, address } })) > 0
        );
      case 'EV_CHARGING':
        return (
          (await this.chargingModel.count({ where: { name, address } })) > 0
        );
      default:
        return false;
    }
  }
}
