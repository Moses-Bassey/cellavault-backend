import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn, WhereOptions } from 'sequelize';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinRepository {
  constructor(@InjectModel(Coin) private readonly coin: typeof Coin) {}

  async sumPassengerCoins(passengerId: string, from?: Date, to?: Date) {
    const where: WhereOptions = { passengerId };
    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    // If ledger uses + / - entries, sum delta
    const row = await this.coin.findOne({
      attributes: [[fn('COALESCE', fn('SUM', col('delta')), 0), 'totalCoins']],
      where,
      raw: true,
    });

    return Number(row?.['totalCoins'] ?? 0);
  }
}
