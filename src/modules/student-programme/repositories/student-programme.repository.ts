import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentProgramme } from '../entities/student-programme.entity';
import { IRegisterStudentProgrammeInput } from '../interfaces/student-programme.interface';
import { Op, WhereOptions } from 'sequelize';
import { PaginationOptions } from 'src/shared/interfaces/pagination-options.interface';
import { encodeCursor } from 'src/utils/cursor.util';

@Injectable()
export class StudentProgrammeRepository {
  constructor(
    @InjectModel(StudentProgramme)
    private readonly studentProgrammeModel: typeof StudentProgramme,
  ) {}

  async register(input: IRegisterStudentProgrammeInput): Promise<StudentProgramme> {
    try {
      // prevent duplicate enrolment
      const existing = await this.studentProgrammeModel.findOne({
        where: { studentId: input.studentId, programmeId: input.programmeId },
      });
      if (existing) {
        throw new ConflictException('Student already enrolled in this programme');
      }

      const record = await this.studentProgrammeModel.create(input as any, {
        raw: true,
        returning: true,
      });
      return record.toJSON() as StudentProgramme;
    } catch (error: any) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to register student in programme');
    }
  }

  async findAll(
    options: PaginationOptions,
  ): Promise<{ studentProgrammes: StudentProgramme[]; nextCursor: string | null }> {
    const { search, limit, cursor } = options;

    const baseConditions: WhereOptions[] = [];

    if (search) {
      baseConditions.push({
        [Op.or]: [
          { studentId: { [Op.like]: `%${search}%` } },
          { programmeId: { [Op.like]: `%${search}%` } },
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

    const rows = await this.studentProgrammeModel.findAll({
      where: pageWhere,
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
      studentProgrammes: pageRows.map((sp) => sp.toJSON() as StudentProgramme),
      nextCursor,
    };
  }

  async findAllByStudent(
    studentId: string,
    options: PaginationOptions,
  ): Promise<{ enrollments: StudentProgramme[]; nextCursor: string | null }> {
    const { search, limit, cursor } = options;

    const baseConditions: WhereOptions[] = [{ studentId }];

    if (search) {
      baseConditions.push({
        programmeId: { [Op.like]: `%${search}%` },
      });
    }

    const baseWhere: WhereOptions = { [Op.and]: baseConditions };

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

    const rows = await this.studentProgrammeModel.findAll({
      where: pageWhere,
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
      enrollments: pageRows.map((sp) => sp.toJSON() as StudentProgramme),
      nextCursor,
    };
  }
}
