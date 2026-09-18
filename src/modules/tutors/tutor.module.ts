import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tutor } from './entities/tutor.entity';
import { TutorController } from './controllers/tutor.controller';
import { TutorService } from './services/tutor.service';
import { TutorEmailListener } from './listeners/tutor.listener';
import { TutorRepository } from './repositories/tutor.repository';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    SequelizeModule.forFeature([Tutor]),
    MailerModule
  ],
  controllers:  [TutorController],
  providers: [
    TutorRepository,
    TutorService,
    TutorEmailListener,
  ],
  exports: [SequelizeModule, TutorService, TutorRepository],
})
export class TutorsModule {}
