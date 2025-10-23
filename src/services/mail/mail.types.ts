import { IsEmail, IsNumber, IsString } from 'class-validator';

export class SendPurchaseReceiptDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  productName: string;

  @IsString()
  vendorName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitNairaPrice: number;

  @IsNumber()
  unitArianPrice: number;

  @IsNumber()
  totalNairaPrice: number;

  @IsNumber()
  totalArianPrice: number;

  @IsNumber()
  trxFeeNaira: number;

  @IsNumber()
  trxFeeArian: number;

  @IsNumber()
  totalNaira: number;

  @IsNumber()
  totalArian: number;
}

export class SendPurchaseReceipt {
  email: string;
  name: string;
  productName: string;
  format: string;
  productPrice?: string | number;
  vendorName?: string;
  quantity?: number;
  unitNairaPrice?: number;
  unitArianPrice?: number;
  totalNairaPrice?: number;
  totalArianPrice?: number;
  trxFeeNaira?: number;
  trxFeeArian?: number;
  totalNaira?: number;
  totalArian?: number;
  totalProducts?: number;
  totalSales?: number;
}
