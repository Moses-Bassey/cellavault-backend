export declare class SignUpOtpSmsEvent {
    readonly phoneNumber: string;
    readonly otpCode: string;
    constructor(phoneNumber: string, otpCode: string);
}
export declare class ForgotPasswordOtpSmsEvent {
    readonly phoneNumber: string;
    readonly otpCode: string;
    constructor(phoneNumber: string, otpCode: string);
}
