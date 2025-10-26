import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class SmsEventService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emitSignUpOtpSms(phoneNumber: string, otpCode: string): Promise<void>;
    emitForgotPasswordOtpSms(phoneNumber: string, otpCode: string): Promise<void>;
}
