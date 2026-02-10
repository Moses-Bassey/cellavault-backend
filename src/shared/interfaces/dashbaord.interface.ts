import { IsString } from 'class-validator';
import { PAYMENT_TYPE } from 'src/enums/payment.enums';

export interface IDashboard {
  userId: string;
  email: string;
  fullName: string;
  phoneNo: string;
  // paymentType: [];
}

export class IDashboardInput {
  @IsString()
  deviceFCMToken: string;

  @IsString()
  ipAddress: string;

  @IsString()
  name: string;
}
