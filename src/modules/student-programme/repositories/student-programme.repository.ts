import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentProgramme } from '../entities/student-programme.entity';
import { IRegisterStudentProgrammeInput } from '../interfaces/student-programme.interface';

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
}
