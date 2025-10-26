export declare class SignUpOtpEmailEvent {
    readonly email: string;
    readonly otpCode: string;
    readonly expiryDate: string;
    constructor(email: string, otpCode: string, expiryDate: string);
}
export declare class ForgetPasswordEmailEvent {
    readonly email: string;
    readonly otpCode: string;
    constructor(email: string, otpCode: string);
}
export declare class WelcomeEmailEvent {
    readonly email: string;
    readonly fullName: string;
    constructor(email: string, fullName: string);
}
export declare class BookingConfirmationEmailEvent {
    readonly email: string;
    readonly bookingId: string;
    readonly driverName: string;
    readonly pickupTime: string;
    readonly pickupLocation: string;
    constructor(email: string, bookingId: string, driverName: string, pickupTime: string, pickupLocation: string);
}
export declare class DriverVerificationEmailEvent {
    readonly email: string;
    readonly fullName: string;
    readonly verificationStatus: 'approved' | 'rejected';
    readonly reason?: string | undefined;
    constructor(email: string, fullName: string, verificationStatus: 'approved' | 'rejected', reason?: string | undefined);
}
export declare class PasswordChangedEmailEvent {
    readonly email: string;
    readonly fullName: string;
    readonly changedAt: string;
    constructor(email: string, fullName: string, changedAt: string);
}
