import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { Coin } from './entities/coin.entity';
// import { Payment } from './entities/payment.entity';
import { CoinRepository } from './repositories/coin.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { MockLedgerStore } from './stores/mck.stores';

@Module({
  imports: [/*SequelizeModule.forFeature([Coin, Payment])*/],
  controllers: [],
  providers: [CoinRepository, PaymentRepository, MockLedgerStore],
  exports: [CoinRepository, PaymentRepository, MockLedgerStore],
})
export class PaymentModule {}
