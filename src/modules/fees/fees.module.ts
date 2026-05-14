import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PeppcruiseFees } from './entities/peppcruise-fees.entity';

@Module({
  imports: [SequelizeModule.forFeature([PeppcruiseFees])],
  providers: [],
  exports: [SequelizeModule],
})
export class FeesModule {}

