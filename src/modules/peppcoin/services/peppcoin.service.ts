import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PeppcoinTransaction } from '../entities/peppcoin-transaction.entity';

@Injectable()
export class PeppcoinService {
  constructor(
    @InjectModel(PeppcoinTransaction)
    private readonly peppcoinTransactionModel: typeof PeppcoinTransaction,
  ) {}

  /**
   * Balance from the ledger: `currentBalance` on the user's latest transaction
   * (by `createdAt`, then `id`). `0` when there are no rows yet.
   */
  /**
 * Returns current PEPP coin balance for a user.
 */
  async getLedgerBalance(userId: string): Promise<number> {
    const last = await this.peppcoinTransactionModel.findOne({
      where: { userId },

      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],

      attributes: ['currentBalance'],
    });

    return Number(last?.currentBalance ?? 0);
  }
}
