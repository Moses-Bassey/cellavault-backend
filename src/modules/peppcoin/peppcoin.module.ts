import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PeppcoinTransaction } from './entities/peppcoin-transaction.entity';
import { PeppcoinService } from './services/peppcoin.service';

@Module({
  imports: [SequelizeModule.forFeature([PeppcoinTransaction])],
  providers: [PeppcoinService],
  exports: [PeppcoinService],
})
export class PeppcoinModule {}
