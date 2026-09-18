import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentProgrammeRepository } from '../repositories/student-programme.repository';
import { IRegisterStudentProgrammeInput } from '../interfaces/student-programme.interface';
import { StudentProgramme } from '../entities/student-programme.entity';
import { StudentsService } from 'src/modules/students/services/student.service';
import { QueryOptions } from 'src/shared/interfaces/query-options.interface';
import { decodeCursor } from 'src/utils/cursor.util';

@Injectable()
export class StudentProgrammeService {
  constructor(
    private readonly studentProgrammeRepository: StudentProgrammeRepository,
    private readonly studentsService: StudentsService
  ) {}

  async registerStudentProgramme(
    input: IRegisterStudentProgrammeInput,
  ): Promise<IRegisterStudentProgrammeInput> {
    const student = await this.studentsService.findById(input.studentId);
    if (!student) throw new NotFoundException(
        'Student not found'
    );
    const data = await this.studentProgrammeRepository.register({
      studentId: student.id,
      programmeId: input.programmeId
    });
    return data;
  }

  async getAllStudentProgrammes(
    params: QueryOptions,
  ): Promise<{ items: StudentProgramme[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);
    const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;

    const { studentProgrammes, nextCursor } = await this.studentProgrammeRepository.findAll({
      search: params.search?.trim(),
      limit,
      cursor,
    });

    return {
      items: studentProgrammes,
      nextCursor,
    };
  }

  async getAllEnrolmentsForStudent(
    studentId: string,
    params: QueryOptions,
  ): Promise<{ items: StudentProgramme[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);
    const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;

    const { enrollments, nextCursor } = await this.studentProgrammeRepository.findAllByStudent(
      studentId,
      {
        search: params.search?.trim(),
        limit,
        cursor,
      },
    );

    return {
      items: enrollments,
      nextCursor,
    };
  }
}
