import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Programme } from './entities/programme.entity';
import { ProgrammeController } from './controllers/programme.controller';
import { ProgrammeService } from './services/programme.service';
import { ProgrammeRepository } from './repositories/programme.repositories';

@Module({
  imports: [SequelizeModule.forFeature([Programme])],
  controllers: [ProgrammeController],
  providers: [ProgrammeService, ProgrammeRepository],
  exports: [SequelizeModule, ProgrammeService, ProgrammeRepository],
})
export class ProgrammeModule {}
