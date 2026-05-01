import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { Op, col, fn, WhereOptions } from 'sequelize';
// import { Payment } from '../entities/payment.entity';
import { MockLedgerStore } from '../stores/mck.stores';

@Injectable()
export class PaymentRepository {
  constructor(
    // @InjectModel(Payment) private readonly payment: typeof Payment,
    private readonly store: MockLedgerStore,
  ) {}

  // async sumPassengerSpend(passengerId: string, from?: Date, to?: Date) {
  //   const where: WhereOptions = { passengerId, status: 'SUCCESS' };
  //   if (from || to) {
  //     where['createdAt'] = {
  //       ...(from ? { [Op.gte]: from } : {}),
  //       ...(to ? { [Op.lte]: to } : {}),
  //     };
  //   }

  //   const row = await this.payment.findOne({
  //     attributes: [[fn('COALESCE', fn('SUM', col('amount')), 0), 'totalSpend']],
  //     where,
  //     raw: true,
  //   });

  //   return Number(row?.['totalSpend'] ?? 0);
  // }
  async sumPassengerSpend(
    passengerId: string,
    from?: Date,
    to?: Date,
  ): Promise<number> {
    return this.store.payments
      .filter((payment) => {
        if (payment.passengerId !== passengerId) return false;
        if (payment.status !== 'SUCCESS') return false;
        if (from && payment.createdAt < from) return false;
        if (to && payment.createdAt > to) return false;
        return true;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  }
}
