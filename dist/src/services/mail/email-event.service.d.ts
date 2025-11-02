import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class EmailEventService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emitSignUpOtpEmail(email: string, otpCode: string, expiryDate: string): Promise<void>;
    emitForgetPasswordEmail(email: string, otp: string): Promise<void>;
    emitWelcomeEmail(email: string, fullName: string): Promise<void>;
    emitBookingConfirmationEmail(email: string, bookingId: string, driverName: string, pickupTime: string, pickupLocation: string): Promise<void>;
    emitDriverVerificationEmail(email: string, fullName: string, verificationStatus: 'approved' | 'rejected', reason?: string): Promise<void>;
    emitPasswordChangedEmail(email: string, fullName: string, changedAt: string): Promise<void>;
    emitNewLoginEmail(email: string, fullName: string, deviceInfo: string, loginTime: string, ipAddress?: string): Promise<void>;
    emitNewDeviceLoginOtpEmail(email: string, otpCode: string): Promise<void>;
}
