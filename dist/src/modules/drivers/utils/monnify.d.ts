export declare class monifyAPI {
    static authenticate(): Promise<any>;
    static fetchBanks(): Promise<any>;
    static validateAccount({ bankCode, accountNumber }: {
        bankCode: any;
        accountNumber: any;
    }): Promise<any>;
}
