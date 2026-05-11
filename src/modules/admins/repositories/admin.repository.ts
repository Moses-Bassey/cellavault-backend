import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../entities/admin.entity';
import { Op, WhereOptions } from 'sequelize';
import { InvitationStatus } from '../../../enums/invite-status.enum';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
  ) {}

  async findById(id: string): Promise<Admin | null> {
    try {
      return await this.adminModel.findByPk(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error finding admin by ID: ${error.message}`);
        throw new Error(`Error finding admin by ID: ${error.message}`);
      } else {
        console.error(`Error finding admin by ID: ${error as any}`);
        throw new Error(`Error finding admin by ID: ${error as any}`);
      }
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      return await this.adminModel.findOne({
        where: { email },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error finding admin by email: ${error.message}`);
        throw new Error(`Error finding admin by email: ${error.message}`);
      } else {
        console.error(`Error finding admin by email: ${error as any}`);
        throw new Error(`Error finding admin by email: ${error as any}`);
      }
    }
  }

  async findAll(options?: {
    limit: number;
    cursor?: { createdAt: Date; id: string };
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ admins: Admin[]; nextCursor: string | null }> {
    const {
      limit,
      cursor,
      search,
      role,
      status,
    } = options || {};

    try {
      const andConditions: any[] = [];

      /* ---------- CURSOR PAGINATION ---------- */

      if (cursor) {
        andConditions.push({
          [Op.or]: [
            { createdAt: { [Op.lt]: cursor.createdAt } },
            {
              createdAt: cursor.createdAt,
              id: { [Op.lt]: cursor.id },
            },
          ],
        });
      }

      /* ---------- SEARCH ---------- */

      if (search?.trim()) {
        andConditions.push({
          [Op.or]: [
            {
              fullname: {
                [Op.like]: `%${search.trim()}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${search.trim()}%`,
              },
            },
            {
              phoneNo: {
                [Op.like]: `%${search.trim()}%`,
              },
            },
          ],
        });
      }

      /* ---------- ROLE FILTER ---------- */

      if (role && role !== 'all') {
        andConditions.push({
          role,
        });
      }

      /* ---------- STATUS FILTER ---------- */

      if (status && status !== 'all') {
        andConditions.push({
          inviteStatus: status.toUpperCase(),
        });
      }

      const where: WhereOptions =
        andConditions.length > 0 ? { [Op.and]: andConditions } : {};

      const rows = await this.adminModel.findAll({
        where,
        attributes: [
          'id',
          'fullName',
          'email',
          'phoneNo',
          'imageUrl',
          'role',
          'inviteStatus',
          'createdAt',
          'invitedAcceptedAt',
          'lastLogin',
        ],
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit,
      });

      const last = rows[rows.length - 1];

      const nextCursor =
        rows.length === limit && last
          ? Buffer.from(
              JSON.stringify({
                createdAt: last.createdAt,
                id: last.id,
              }),
            ).toString('base64')
          : null;

      return {
        admins: rows,
        nextCursor,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error finding all admins: ${error.message}`);
        throw new Error(`Error finding all admins: ${error.message}`);
      }

      console.error(`Error finding all admins: ${String(error)}`);
      throw new Error(`Error finding all admins: ${String(error)}`);
    }
  }

  async getAdminSummary() {
    const [total, active, pendingInvite, expired] = await Promise.all([
      this.adminModel.count(),

      this.adminModel.count({
        where: {
          inviteStatus: InvitationStatus.ACTIVE,
        },
      }),

      this.adminModel.count({
        where: {
          inviteStatus: InvitationStatus.PENDING,
        },
      }),

      this.adminModel.count({
        where: {
          inviteStatus: InvitationStatus.EXPIRED,
        },
      }),
    ]);

    return {
      total,
      active,
      pendingInvite,
      expired,
    };
  }

  async update(
    id: string,
    updates: Partial<Admin>,
  ): Promise<[number, Admin[]]> {
    try {
      return await this.adminModel.update(updates, {
        where: { id },
        returning: true,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error updating admin: ${error.message}`);
        throw new Error(`Error updating admin: ${error.message}`);
      } else {
        console.error(`Error updating admin: ${error as any}`);
        throw new Error(`Error updating admin: ${error as any}`);
      }
    }
  }
}
