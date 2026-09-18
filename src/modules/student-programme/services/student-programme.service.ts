import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentProgrammeRepository } from '../repositories/student-programme.repository';
import { IRegisterStudentProgrammeInput } from '../interfaces/student-programme.interface';
import { StudentProgramme } from '../entities/student-programme.entity';
import { StudentsService } from 'src/modules/students/services/student.service';

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
}
