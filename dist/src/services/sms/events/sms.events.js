"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordOtpSmsEvent = exports.SignUpOtpSmsEvent = void 0;
class SignUpOtpSmsEvent {
    phoneNumber;
    otpCode;
    constructor(phoneNumber, otpCode) {
        this.phoneNumber = phoneNumber;
        this.otpCode = otpCode;
    }
}
exports.SignUpOtpSmsEvent = SignUpOtpSmsEvent;
class ForgotPasswordOtpSmsEvent {
    phoneNumber;
    otpCode;
    constructor(phoneNumber, otpCode) {
        this.phoneNumber = phoneNumber;
        this.otpCode = otpCode;
    }
}
exports.ForgotPasswordOtpSmsEvent = ForgotPasswordOtpSmsEvent;
//# sourceMappingURL=sms.events.js.map