import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { UserStatusFilter } from '../../../enums/user-status.enum';
import { Tutor } from '../entities/tutor.entity';
import { encodeCursor } from '../../../utils/cursor.util';
import { PaginationOptions } from '../../../shared/interfaces/pagination-options.interface';


@Injectable()
export class TutorRepository {
  constructor(
    @InjectModel(Tutor)
    private readonly tutorModel: typeof Tutor,
  ) {}

  async findById(id: string): Promise<Tutor | null> {
    return await this.tutorModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<Tutor | null> {
    const user = await this.tutorModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
    });
    return user ? (user.toJSON() as Tutor) : null;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    const user = await this.tutorModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as Tutor) : null;
  }

  async create(userData: Partial<Tutor>): Promise<Tutor> {
    try {
      const user = await this.tutorModel.create(userData as any, {
        raw: true,
        returning: true,
      });
      return user.toJSON() as Tutor;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Tutor with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create tutor');
    }
  }

  async findAll(
    options: PaginationOptions,
  ): Promise<{ tutors: Tutor[]; nextCursor: string | null }> {
    const { search, limit, cursor } = options;

    // ── Base WHERE ───────────────────────────────
    const baseConditions: WhereOptions[] = [];

    if (search) {
      baseConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    const baseWhere: WhereOptions = baseConditions.length
      ? { [Op.and]: baseConditions }
      : {};

    // ── Cursor WHERE ─────────────────────────────
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

    // ── Fetch rows ───────────────────────────────
    const rows = await this.tutorModel.findAll({
      where: pageWhere,
      attributes: { exclude: ['password', 'deletedAt'] },
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
      tutors: pageRows.map(t => t.toJSON() as Tutor),
      nextCursor,
    };
  }

  async delete(id: string): Promise<number> {
    return await this.tutorModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<Tutor[] | null> {
    return await this.tutorModel.findAll({
      where: { isActive: false },
    });
  }

  async update(id: string, userData: Partial<Tutor>): Promise<number | null> {
    const [affectedRows] = await this.tutorModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }
}
