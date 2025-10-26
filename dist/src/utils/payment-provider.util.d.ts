export declare class PaymentProviderUtil {
    private static readonly logger;
    static verifyStripeTransaction(transactionId: string): Promise<boolean>;
    static verifyStripeSession(sessionId: string): Promise<boolean>;
}
