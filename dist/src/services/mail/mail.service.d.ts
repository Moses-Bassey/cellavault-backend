import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendForgetPasswordEmail(email: string, resetLink: string): Promise<void>;
    sendSignUpOtpEmail(email: string, otpCode: string, expiryDate: string): Promise<void>;
}
