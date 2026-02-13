import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn, WhereOptions } from 'sequelize';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel(Payment) private readonly payment: typeof Payment) {}

  async sumPassengerSpend(passengerId: string, from?: Date, to?: Date) {
    const where: WhereOptions = { passengerId, status: 'SUCCESS' };
    if (from || to) {
      where['createdAt'] = {
        ...(from ? { [Op.gte]: from } : {}),
        ...(to ? { [Op.lte]: to } : {}),
      };
    }

    const row = await this.payment.findOne({
      attributes: [[fn('COALESCE', fn('SUM', col('amount')), 0), 'totalSpend']],
      where,
      raw: true,
    });

    return Number(row?.['totalSpend'] ?? 0);
  }
}
