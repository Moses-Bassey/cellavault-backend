"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderUtil = void 0;
const common_1 = require("@nestjs/common");
class PaymentProviderUtil {
    static logger = new common_1.Logger(PaymentProviderUtil.name);
    static async verifyStripeTransaction(transactionId) {
        try {
            const secretKey = process.env.STRIPE_SECRET_KEY;
            if (!secretKey) {
                this.logger.error('STRIPE_SECRET_KEY environment variable is not set');
                return false;
            }
            const response = await fetch(`https://api.stripe.com/v1/payment_intents/${transactionId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (!response.ok) {
                this.logger.warn(`Failed to verify Stripe transaction: ${transactionId}, status: ${response.status}`);
                return false;
            }
            const data = await response.json();
            if (data.status === 'succeeded') {
                this.logger.log(`Stripe transaction verified successfully: ${transactionId}`);
                return true;
            }
            else {
                this.logger.warn(`Stripe transaction verification failed: ${transactionId}, status: ${data.status}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error('Error verifying Stripe transaction:', error);
            return false;
        }
    }
    static async verifyStripeSession(sessionId) {
        try {
            const secretKey = process.env.STRIPE_SECRET_KEY;
            if (!secretKey) {
                this.logger.error('STRIPE_SECRET_KEY environment variable is not set');
                return false;
            }
            const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (!response.ok) {
                this.logger.warn(`Failed to verify Stripe session: ${sessionId}, status: ${response.status}`);
                return false;
            }
            const session = await response.json();
            if (session.payment_status === 'paid') {
                this.logger.log(`Stripe session verified successfully: ${sessionId}`);
                return true;
            }
            else {
                this.logger.warn(`Stripe session not paid: ${sessionId}, status: ${session.payment_status}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error('Error verifying Stripe session:', error);
            return false;
        }
    }
}
exports.PaymentProviderUtil = PaymentProviderUtil;
//# sourceMappingURL=payment-provider.util.js.map