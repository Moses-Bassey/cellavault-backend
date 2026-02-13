import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coin } from './entities/coin.entity';
import { Payment } from './entities/payment.entity';
import { CoinRepository } from './repositories/coin.repository';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [SequelizeModule.forFeature([Coin, Payment])],
  controllers: [],
  providers: [CoinRepository, PaymentRepository],
  exports: [CoinRepository, PaymentRepository],
})
export class PaymentModule {}