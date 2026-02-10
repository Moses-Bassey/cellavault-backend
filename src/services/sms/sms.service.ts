import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: Twilio | null;
  private readonly fromNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('app.twilioAccountSid');
    const authToken = this.configService.get<string>('app.twilioAuthToken');
    this.fromNumber =
      this.configService.get<string>('app.twilioFromNumber') || '';

    if (!accountSid || !authToken) {
      this.logger.warn(
        'Twilio credentials not configured. SMS functionality will be limited.',
      );
      this.client = null;
    } else {
      this.client = new Twilio(accountSid, authToken);
      this.logger.log('Twilio SMS service initialized');
    }
  }

  async sendOtp(
    phoneNumber: string,
    otpCode: string,
    message?: string,
  ): Promise<void> {
    if (!this.client) {
      this.logger.error('Twilio client not initialized. Cannot send SMS.');
      throw new Error('SMS service not configured');
    }

    const smsMessage =
      message ||
      `Your PeppCruise verification code is: ${otpCode}. Valid for 10 minutes.`;

    try {
      const result = await this.client.messages.create({
        body: smsMessage,
        from: this.fromNumber,
        to: phoneNumber,
      });

      this.logger.log(
        `SMS sent successfully to ${phoneNumber}. SID: ${result.sid}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
