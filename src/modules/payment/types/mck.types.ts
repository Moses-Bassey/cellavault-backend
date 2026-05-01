export type CoinRecord = {
  id: string;
  passengerId: string;
  delta: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type PaymentRecord = {
  id: string;
  passengerId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};