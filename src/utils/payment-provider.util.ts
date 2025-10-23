import { Logger } from '@nestjs/common';

export class PaymentProviderUtil {
  private static readonly logger = new Logger(PaymentProviderUtil.name);

  /**
   * Verify Stripe transaction by making API call to Stripe
   * @param transactionId - Stripe transaction ID
   * @returns Promise<boolean> - true if transaction is valid and successful
   */
  static async verifyStripeTransaction(
    transactionId: string,
  ): Promise<boolean> {
    try {
      const secretKey = process.env.STRIPE_SECRET_KEY;

      if (!secretKey) {
        this.logger.error('STRIPE_SECRET_KEY environment variable is not set');
        return false;
      }

      // Make API call to Stripe to verify payment intent
      const response = await fetch(
        `https://api.stripe.com/v1/payment_intents/${transactionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!response.ok) {
        this.logger.warn(
          `Failed to verify Stripe transaction: ${transactionId}, status: ${response.status}`,
        );
        return false;
      }

      const data = await response.json();

      if (data.status === 'succeeded') {
        this.logger.log(
          `Stripe transaction verified successfully: ${transactionId}`,
        );
        return true;
      } else {
        this.logger.warn(
          `Stripe transaction verification failed: ${transactionId}, status: ${data.status}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error('Error verifying Stripe transaction:', error);
      return false;
    }
  }

  /**
   * Verify Stripe session by making API call to Stripe
   * @param sessionId - Stripe session ID
   * @returns Promise<boolean> - true if session is valid and paid
   */
  static async verifyStripeSession(sessionId: string): Promise<boolean> {
    try {
      const secretKey = process.env.STRIPE_SECRET_KEY;

      if (!secretKey) {
        this.logger.error('STRIPE_SECRET_KEY environment variable is not set');
        return false;
      }

      // Make API call to Stripe to verify checkout session
      const response = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!response.ok) {
        this.logger.warn(
          `Failed to verify Stripe session: ${sessionId}, status: ${response.status}`,
        );
        return false;
      }

      const session = await response.json();

      if (session.payment_status === 'paid') {
        this.logger.log(`Stripe session verified successfully: ${sessionId}`);
        return true;
      } else {
        this.logger.warn(
          `Stripe session not paid: ${sessionId}, status: ${session.payment_status}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error('Error verifying Stripe session:', error);
      return false;
    }
  }
}
