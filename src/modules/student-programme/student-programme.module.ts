import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsModule } from '../students/student.module';
import { StudentProgramme } from './entities/student-programme.entity';
import { StudentProgrammeController } from './controllers/student-programme.controller';
import { StudentProgrammeService } from './services/student-programme.service';
import { StudentProgrammeRepository } from './repositories/student-programme.repository';

@Module({
  imports: [SequelizeModule.forFeature([StudentProgramme]), StudentsModule],
  controllers: [StudentProgrammeController],
  providers: [StudentProgrammeService, StudentProgrammeRepository],
  exports: [SequelizeModule, StudentProgrammeService, StudentProgrammeRepository],
})
export class StudentProgrammeModule {}
