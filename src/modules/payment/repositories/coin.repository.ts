import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { Op, col, fn, WhereOptions } from 'sequelize';
// import { Coin } from '../entities/coin.entity';
import { MockLedgerStore } from '../stores/mck.stores';

@Injectable()
export class CoinRepository {
  constructor(
    // @InjectModel(Coin) private readonly coin: typeof Coin,
    private readonly store: MockLedgerStore,
  ) {}

  // async sumPassengerCoins(passengerId: string, from?: Date, to?: Date) {
  //   const where: WhereOptions = { passengerId };
  //   if (from || to) {
  //     where['createdAt'] = {
  //       ...(from ? { [Op.gte]: from } : {}),
  //       ...(to ? { [Op.lte]: to } : {}),
  //     };
  //   }

  //   // If ledger uses + / - entries, sum delta
  //   const row = await this.coin.findOne({
  //     attributes: [[fn('COALESCE', fn('SUM', col('delta')), 0), 'totalCoins']],
  //     where,
  //     raw: true,
  //   });

  //   return Number(row?.['totalCoins'] ?? 0);
  // }

  async sumPassengerCoins(
    passengerId: string,
    from?: Date,
    to?: Date,
  ): Promise<number> {
    return this.store.coins
      .filter((coin) => {
        if (coin.passengerId !== passengerId) return false;
        if (from && coin.createdAt < from) return false;
        if (to && coin.createdAt > to) return false;
        return true;
      })
      .reduce((sum, coin) => sum + coin.delta, 0);
  }
}
