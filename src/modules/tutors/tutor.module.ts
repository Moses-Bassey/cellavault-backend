import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tutor } from './entities/tutor.entity';
// import { TutorController } from './controllers/tutor.controller';
// import { TutorService } from './services/tutor.service';
import { TutorRepository } from './repositories/tutor.repository';

@Module({
  imports: [SequelizeModule.forFeature([Tutor])],
  controllers: [], // [TutorController],
  providers: [TutorRepository], // [TutorService, ],
  exports: [SequelizeModule, TutorRepository], // [SequelizeModule, TutorService, TutorRepository],
})
export class TutorsModule {}
