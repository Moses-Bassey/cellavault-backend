import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './entities/student.entity';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { StudentRepository } from './repositories/student.repository';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [SequelizeModule, StudentService, StudentRepository],
})
export class StudentsModule {}
