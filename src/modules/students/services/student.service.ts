import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { ICreateStudentInput } from '../interfaces/student.interface';
import { Student } from '../entities/student.entity';
import { QueryOptions } from 'src/shared/interfaces/query-options.interface';
import { decodeCursor } from 'src/utils/cursor.util';
import { PasswordUtil } from 'src/utils/password.util';
import { Utils } from 'src/utils/utils';
import { UserType } from 'src/enums/user-type.enum';
import {
  ChangeStudentPasswordData,
  StudentProfile,
  UpdateStudentProfileData,
} from '../interfaces/student.interface';
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

  async getMyProfile(
    studentId: string,
  ): Promise<StudentProfile> {
    const student =
      await this.studentRepository.findProfileById(
        studentId,
      );

    if (!student) {
      throw new NotFoundException(
        'Student account not found',
      );
    }

    return this.mapStudentProfile(student);
  }

  async updateMyProfile(
    studentId: string,
    data: UpdateStudentProfileData,
  ): Promise<StudentProfile> {
    const student =
      await this.studentRepository.findById(studentId);

    if (!student) {
      throw new NotFoundException(
        'Student account not found',
      );
    }

    if (!student.isActive) {
      throw new UnauthorizedException(
        'Student account is inactive',
      );
    }

    const updateData: Partial<Student> = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();

      if (email !== student.email.toLowerCase()) {
        const existingStudent =
          await this.studentRepository.findByEmailExcludingId(
            email,
            studentId,
          );

        if (existingStudent) {
          throw new ConflictException(
            'A student account with this email already exists',
          );
        }

        updateData.email = email;
      }
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone?.trim() || undefined;
    }

    if (data.guardianPhoneOrEmail !== undefined) {
      updateData.guardianPhoneOrEmail =
        data.guardianPhoneOrEmail?.trim() || undefined;
    }

    if (data.gender !== undefined) {
      updateData.gender = data.gender?.trim() || undefined;
    }

    if (data.photoUrl !== undefined) {
      updateData.photoUrl =
        data.photoUrl?.trim() || undefined;
    }

    if (Object.keys(updateData).length > 0) {
      await this.studentRepository.update(
        studentId,
        updateData,
      );
    }

    const updatedStudent =
      await this.studentRepository.findProfileById(
        studentId,
      );

    if (!updatedStudent) {
      throw new NotFoundException(
        'Student account not found',
      );
    }

    return this.mapStudentProfile(updatedStudent);
  }

  async changeMyPassword(
    studentId: string,
    data: ChangeStudentPasswordData,
  ): Promise<void> {
    const student =
      await this.studentRepository.findById(studentId);

    if (!student) {
      throw new NotFoundException(
        'Student account not found',
      );
    }

    if (!student.isActive) {
      throw new UnauthorizedException(
        'Student account is inactive',
      );
    }

    const isCurrentPasswordValid =
      await PasswordUtil.verifyPassword(
        data.currentPassword,
        student.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    if (data.currentPassword === data.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword =
      await PasswordUtil.hashPassword(
        data.newPassword,
      );

    await this.studentRepository.update(studentId, {
      password: hashedPassword,
    });
  }

  private mapStudentProfile(
    student: Student,
  ): StudentProfile {
    const studentJson = student.toJSON() as Student & {
      programmes?: Array<{
        id: string;
        name: string;
      }>;
    };

    return {
      id: studentJson.id,
      name: studentJson.name,
      email: studentJson.email,
      phone: studentJson.phone ?? null,
      guardianPhoneOrEmail:
        studentJson.guardianPhoneOrEmail ?? null,
      gender: studentJson.gender ?? null,
      photoUrl: studentJson.photoUrl ?? null,
      role: studentJson.role,
      isActive: studentJson.isActive,

      programmes: (studentJson.programmes ?? []).map(
        (programme) => ({
          id: programme.id,
          name: programme.name,
        }),
      ),

      createdAt: studentJson.createdAt,
      updatedAt: studentJson.updatedAt,
    };
  }
}