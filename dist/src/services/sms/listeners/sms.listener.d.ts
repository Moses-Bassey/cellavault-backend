import { SmsService } from '../sms.service';
import { SignUpOtpSmsEvent, ForgotPasswordOtpSmsEvent } from '../events/sms.events';
export declare class SmsEventListener {
    private readonly smsService;
    private readonly logger;
    constructor(smsService: SmsService);
    handleSignUpOtpEvent(event: SignUpOtpSmsEvent): Promise<void>;
    handleForgotPasswordOtpEvent(event: ForgotPasswordOtpSmsEvent): Promise<void>;
}
