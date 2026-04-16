import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../entities/admin.entity';
import { Op } from 'sequelize';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
  ) {}

  async create(adminData: Partial<Admin>): Promise<Admin> {
    try {
      return await this.adminModel.create(adminData as any);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error creating admin: ${error.message}`);
        throw new Error(`Error creating admin: ${error.message}`);
      } else {
        console.error(`Error creating admin: ${error as any}`);
        throw new Error(`Error creating admin: ${error as any}`);
      }
    }
  }

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
  }): Promise<{ admins: Admin[]; nextCursor: string | null }> {
    const { limit = 20, cursor } = options || {};

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

      const where = andConditions.length
        ? { [Op.and]: andConditions }
        : undefined;

      const rows = await this.adminModel.findAll({
        where,
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit,

        /* EXCLUDE PASSWORD AT DB LEVEL */
        attributes: {
          exclude: ['password'],
        },
      });

      /* ---------- NEXT CURSOR ---------- */

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

  async delete(id: string): Promise<number> {
    try {
      return await this.adminModel.destroy({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error deleting admin: ${error.message}`);
        throw new Error(`Error deleting admin: ${error.message}`);
      } else {
        console.error(`Error deleting admin: ${error as any}`);
        throw new Error(`Error deleting admin: ${error as any}`);
      }
    }
  }

  async restore(id: string): Promise<void> {
    try {
      // Soft delete restore: set deletedAt back to null
      return await this.adminModel.restore({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error restoring admin: ${error.message}`);
        throw new Error(`Error restoring admin: ${error.message}`);
      } else {
        console.error(`Error restoring admin: ${error as any}`);
        throw new Error(`Error restoring admin: ${error as any}`);
      }
    }
  }
}
