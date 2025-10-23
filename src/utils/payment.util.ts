import * as randomstring from 'randomstring';

export class PaymentUtil {
  /**
   * Generates a unique payment reference for subscriptions
   * Format: sub_{randomString}
   * @returns {string} Unique payment reference
   */
  static generatePaymentReference(): string {
    const randomString = randomstring.generate(12);
    return `sub_${randomString}`;
  }

  /**
   * Generates a unique payment reference with custom prefix
   * @param {string} prefix - Custom prefix for the reference
   * @returns {string} Unique payment reference
   */
  static generateCustomPaymentReference(prefix: string): string {
    const randomString = randomstring.generate(12);
    return `${prefix}_${randomString}`;
  }
}
