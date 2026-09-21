import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../entities/student.entity';
import { Programme } from '../../programmes/entities/programme.entity';
import { Op, WhereOptions } from 'sequelize';
import { PaginationOptions } from 'src/shared/interfaces/pagination-options.interface';
import { encodeCursor } from 'src/utils/cursor.util';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async create(userData: Partial<Student>): Promise<Student> {
    try {
      const user = await this.studentModel.create(userData as any, {
        raw: true,
        returning: true,
      });
      return user.toJSON() as Student;
    } catch (error: any) {
      // Sequelize unique constraint
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Student with this email already exists');
      }
      // Unexpected DB error
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findById(id: string): Promise<Student | null> {
    return await this.studentModel.findByPk(id, { raw: true });
  }

  async findProfileById(
    id: string,
  ): Promise<Student | null> {
    return await this.studentModel.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'guardianPhoneOrEmail',
        'gender',
        'photoUrl',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Programme,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  async fetchStudent(id: string): Promise<Student | null> {
    const user = await this.studentModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
    });
    return user ? (user.toJSON() as Student) : null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.studentModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as Student) : null;
  }

  async findByEmailExcludingId(
    email: string,
    id: string,
  ): Promise<Student | null> {
    return await this.studentModel.findOne({
      where: {
        email,
        id: {
          [Op.ne]: id,
        },
      },
      attributes: ['id'],
      raw: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.studentModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<Student[] | null> {
    return await this.studentModel.findAll({
      where: { isActive: false },
    });
  }

  async update(id: string, userData: Partial<Student>): Promise<number | null> {
    const [affectedRows] = await this.studentModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }

  async findAll(
    options: PaginationOptions,
  ): Promise<{ students: Student[]; nextCursor: string | null }> {
    const { search, limit, cursor, gender } = options;

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

    if (gender) {
      baseConditions.push({ gender });
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
    const rows = await this.studentModel.findAll({
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
      students: pageRows.map((r) => r.toJSON() as Student),
      nextCursor,
    };
  }
}
