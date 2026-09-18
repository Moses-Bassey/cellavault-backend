import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Programme } from '../entities/programme.entity';
import { Op, WhereOptions } from 'sequelize';
import { PaginationOptions } from 'src/shared/interfaces/pagination-options.interface';
import { encodeCursor } from 'src/utils/cursor.util';

@Injectable()
export class ProgrammeRepository {
  constructor(
    @InjectModel(Programme)
    private readonly programmeModel: typeof Programme,
  ) {}

  async findAll(
    options: PaginationOptions,
  ): Promise<{ programmes: Programme[]; nextCursor: string | null }> {
    const { search, limit, cursor } = options;

    const baseConditions: WhereOptions[] = [];

    if (search) {
      baseConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    const baseWhere: WhereOptions = baseConditions.length
      ? { [Op.and]: baseConditions }
      : {};

    const pageWhere: WhereOptions = cursor
      ? {
          [Op.and]: [
            baseWhere,
            {
              [Op.or]: [
                { createdAt: { [Op.lt]: cursor.createdAt } },
                {
                  createdAt: cursor.createdAt,
                  id: { [Op.lt]: cursor.id },
                },
              ],
            },
          ],
        }
      : baseWhere;

    const rows = await this.programmeModel.findAll({
      where: pageWhere,
      attributes: { exclude: ['deletedAt'] },
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      limit: limit + 1,
    });

    const hasNextPage = rows.length > limit;
    const pageRows = hasNextPage ? rows.slice(0, limit) : rows;

    const last = pageRows[pageRows.length - 1];
    const nextCursor =
      hasNextPage && last
        ? encodeCursor({ createdAt: last.createdAt, id: last.id })
        : null;

    return {
      programmes: pageRows.map((p) => p.toJSON() as Programme),
      nextCursor,
    };
  }
}
