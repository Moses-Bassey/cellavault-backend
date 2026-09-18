import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { ICreateStudentInput } from '../interfaces/student.interface';
import { Student } from '../entities/student.entity';
import { QueryOptions } from 'src/shared/interfaces/query-options.interface';
import { decodeCursor } from 'src/utils/cursor.util';
import { PasswordUtil } from 'src/utils/password.util';
import { Utils } from 'src/utils/utils';
import { UserType } from 'src/enums/user-type.enum';

@Injectable()
export class StudentsService {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Create a student account.
   * - If dto.password is provided, it will be hashed and used.
   * - If not provided, a secure temporary password is generated and returned in the result object (so caller can email it).
   */
  async createStudent(input: ICreateStudentInput): Promise<ICreateStudentInput> {
    // Normalize email
    input.email = input.email.toLowerCase().trim();

    // hash provided password
    const hashedPassword = await PasswordUtil.hashPassword(input.password);

    // Ensure role and isActive defaults
    const payload: Partial<Student> = {
      name: input.name,
      email: input.email,
      phone: input.phone ? Utils.normalizeCountryPhone('+234', input.phone, 13) : undefined,
      guardianPhoneOrEmail: input.guardianPhoneOrEmail ?? undefined,
      password: hashedPassword,
      gender: input.gender ?? undefined,
      photoUrl: input.photoUrl ?? undefined,
      role: UserType.STUDENT,
      isActive: true,
    };

    const student = await this.studentRepository.create(payload);

    if (!student) {
      throw new InternalServerErrorException('Failed to create student');
    }

    return input;
  }

  async getAllStudents(
    params: QueryOptions,
  ): Promise<{ items: Student[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);
    const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;

    const { students, nextCursor } = await this.studentRepository.findAll({
      search: params.search?.trim(),
      limit,
      cursor,
      gender: params.gender ?? null,
    });

    return {
      items: students,
      nextCursor,
    };
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepository.fetchStudent(id);
    if (!student) throw new NotFoundException('Student not found');
    console.log('Student: ', student);
    return student;
  }
}
