import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './entities/student.entity';
import { StudentsController } from './controllers/student.controller';
import { StudentsService } from './services/student.service';
import { StudentRepository } from './repositories/student.repository';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentRepository, StudentsService],
  exports: [SequelizeModule, StudentRepository, StudentsService],
})
export class StudentsModule {}
