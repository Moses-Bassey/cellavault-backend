import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op, WhereOptions } from 'sequelize';
import { Country } from 'src/modules/countries/entities';
import { UserStatusFilter } from '../../../enums/user-status.enum';
import { encodeCursor } from '../../../utils/cursor.util';

interface RepositoryParams {
  search?: string;
  status?: string;
  limit: number;
  offset: number;
}

// ─── Attributes ────────────────────────────────────────────────────────────────
// Fetch only the columns the list view actually needs.
// Omitting: password, loginType, userType, hasPasscode, countryId, deletedAt.

const LIST_ATTRIBUTES: (keyof User)[] = [
  'id',
  'fullName',
  'phoneNo',
  'email',
  'imageUrl',
  'isActive',
  'isDisabled',
  'isEmailVerified',
  'isPhoneVerified',
  'createdAt',
  'updatedAt',
];

// ─── Status → WHERE conditions ────────────────────────────────────────────────

function buildStatusCondition(status: UserStatusFilter): WhereOptions {
  switch (status) {
    case 'active':
      return {
        isDisabled: false,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      };

    case 'inactive':
      return {
        isDisabled: false,
        isActive: false,
        isEmailVerified: true,
        isPhoneVerified: true,
      };

    case 'pending':
      // Verified users whose email OR phone isn't confirmed yet.
      return {
        isDisabled: false,
        [Op.or]: [
          { isEmailVerified: false },
          { isPhoneVerified: false },
        ],
      };

    case 'banned':
      return { isDisabled: true };
  }
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
      include: [
        {
          model: Country,
        },
      ],
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as User) : null;
  }

  async delete(id: string): Promise<number> {
    return await this.userModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<User[] | null> {
    return await this.userModel.findAll({
      where: { isDisabled },
    });
  }

  // async create(userData: Partial<User>): Promise<User> {
  //   const user = await this.userModel.create(userData as any, {
  //     raw: true,
  //     returning: true,
  //   });
  //   return user.toJSON() as User;
  // }

  async update(id: string, userData: Partial<User>): Promise<number | null> {
    const [affectedRows] = await this.userModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }

  // async findWithCountry(
  //   email: string,
  //   userType: UserType,
  // ): Promise<User | null> {
  //   return await this.userModel.findOne({
  //     where: { email, userType },
  //     include: ['country'],
  //   });
  // }

  async findAll(options: {
    search?: string;
    status?: UserStatusFilter;
    limit: number;
    cursor?: { createdAt: Date; id: string };
  }): Promise<{ users: User[]; nextCursor: string | null }> {
    const { search, status, limit, cursor } = options;

    // ── Base WHERE ─────────────────────────────────────────────────────────────
    const baseConditions: WhereOptions[] = [];

    if (status) {
      baseConditions.push(buildStatusCondition(status));
    }

    if (search) {
      baseConditions.push({
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { phoneNo: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    const baseWhere: WhereOptions = baseConditions.length
      ? { [Op.and]: baseConditions }
      : {};

    // ── Cursor WHERE ───────────────────────────────────────────────────────────
    const pageWhere: WhereOptions = cursor
      ? {
          [Op.and]: [
            baseWhere,
            {
              [Op.or]: [
                {
                  createdAt: {
                    [Op.lt]: cursor.createdAt,
                  },
                },
                {
                  createdAt: cursor.createdAt,
                  id: {
                    [Op.lt]: cursor.id,
                  },
                },
              ],
            },
          ],
        }
      : baseWhere;

    // ── Fetch one extra row to detect next page ───────────────────────────────
    const rows = await this.userModel.findAll({
      where: pageWhere,

      attributes: LIST_ATTRIBUTES,

      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],

      limit: limit + 1,
    });

    // ── Determine if next page exists ─────────────────────────────────────────
    const hasNextPage = rows.length > limit;

    // remove extra row
    const pageRows = hasNextPage
      ? rows.slice(0, limit)
      : rows;

    // ── Generate next cursor ──────────────────────────────────────────────────
    const last = pageRows[pageRows.length - 1];

    const nextCursor =
      hasNextPage && last
        ? encodeCursor({
            createdAt: last.createdAt,
            id: last.id,
          })
        : null;

    return {
      users: pageRows,
      nextCursor,
    };
  }

  async countAll(): Promise<User[] | null> {
    return await this.userModel.findAll();
  }

  async countFiltered(options: {
    search?: string;
    status?: boolean;
  }): Promise<number> {
    const { search, status } = options;
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { phoneNo: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) {
      where.isActive = status;
    }
    return this.userModel.count({ where });
  }

  async findAllBanned(isDisabled: boolean): Promise<User[]> {
    return await this.userModel.findAll({
      where: { isDisabled },
    });
  }

  async getNewUsersForMonth(year: number, month: number): Promise<User[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.userModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }
}
