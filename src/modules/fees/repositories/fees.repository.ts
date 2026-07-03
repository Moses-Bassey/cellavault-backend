import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { PeppcruiseFees } from '../entities/peppcruise-fees.entity';
import { encodeCursor } from '../../../utils/cursor.util';

@Injectable()
export class FeesRepository {
  constructor(
    @InjectModel(PeppcruiseFees)
    private readonly feeModel: typeof PeppcruiseFees,
  ) {}

  async createFee(
    payload: Partial<PeppcruiseFees>,
  ) {
    return this.feeModel.create(payload as any);
  }

  async updateFee(
    id: string,
    payload: Partial<PeppcruiseFees>,
  ) {
    const [affectedRows] =
      await this.feeModel.update(payload, {
        where: { id },
      });

    if (!affectedRows) return null;

    return affectedRows;
  }

  async findById(id: string) {
    return this.feeModel.findByPk(id);
  }

  async findByClassName(
    className: string,
  ) {
    return this.feeModel.findOne({
      where: {
        className,
      },
    });
  }

  async fetchFees(params: {
    limit: number;
    search?: string;
    cursor?: { createdAt: Date; id: string } | null;
  }) {
    const {
      limit,
      search,
      cursor,
    } = params;

    const where: any = {};

    if (search?.trim()) {
      where.className = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    if (cursor) {
      where[Op.or] = [
        {
          createdAt: {
            [Op.lt]: new Date(
              cursor.createdAt,
            ),
          },
        },
        {
          createdAt: new Date(
            cursor.createdAt,
          ),
          id: {
            [Op.lt]: cursor.id,
          },
        },
      ];
    }

    const rows =
      await this.feeModel.findAll({
        where,
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: limit + 1,
      });

    const hasMore =
      rows.length > limit;

    const data = hasMore
      ? rows.slice(0, limit)
      : rows;

    const last =
      data[data.length - 1];

    return {
      data,
      nextCursor:
        hasMore && last
          ? encodeCursor({
              createdAt:
                last.createdAt,
              id: last.id,
              })
            : null,
      };
    }

  async findAllActive() {
    return this.feeModel.findAll({
      order: [['className', 'ASC']],
    });
  }

  async deleteFee(
    id: string,
  ): Promise<boolean> {
    const deleted = await this.feeModel.destroy({
      where: { id },
    });

    return deleted > 0;
  }
}