export declare class SendPurchaseReceiptDto {
    email: string;
    name: string;
    productName: string;
    vendorName: string;
    quantity: number;
    unitNairaPrice: number;
    unitArianPrice: number;
    totalNairaPrice: number;
    totalArianPrice: number;
    trxFeeNaira: number;
    trxFeeArian: number;
    totalNaira: number;
    totalArian: number;
}
export declare class SendPurchaseReceipt {
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
