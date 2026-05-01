import { Injectable } from '@nestjs/common';
import { CoinRecord, PaymentRecord } from '../types/mck.types';

@Injectable()
export class MockLedgerStore {
  readonly coins: CoinRecord[] = [];
  readonly payments: PaymentRecord[] = [];
}