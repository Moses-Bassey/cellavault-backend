import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PeppcruiseFees } from './entities/peppcruise-fees.entity';
import { FeesRepository } from './repositories/fees.repository';
import { FeesService } from './services/fees.service';
import { FeesController } from './controllers/fees.controller';

@Module({
  imports: [SequelizeModule.forFeature([PeppcruiseFees])],
  controllers: [FeesController],
  providers: [FeesService, FeesRepository],
  exports: [SequelizeModule],
})
export class FeesModule {}

