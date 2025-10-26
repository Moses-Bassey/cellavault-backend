"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordChangedEmailEvent = exports.DriverVerificationEmailEvent = exports.BookingConfirmationEmailEvent = exports.WelcomeEmailEvent = exports.ForgetPasswordEmailEvent = exports.SignUpOtpEmailEvent = void 0;
class SignUpOtpEmailEvent {
    email;
    otpCode;
    expiryDate;
    constructor(email, otpCode, expiryDate) {
        this.email = email;
        this.otpCode = otpCode;
        this.expiryDate = expiryDate;
    }
}
exports.SignUpOtpEmailEvent = SignUpOtpEmailEvent;
class ForgetPasswordEmailEvent {
    email;
    otpCode;
    constructor(email, otpCode) {
        this.email = email;
        this.otpCode = otpCode;
    }
}
exports.ForgetPasswordEmailEvent = ForgetPasswordEmailEvent;
class WelcomeEmailEvent {
    email;
    fullName;
    constructor(email, fullName) {
        this.email = email;
        this.fullName = fullName;
    }
}
exports.WelcomeEmailEvent = WelcomeEmailEvent;
class BookingConfirmationEmailEvent {
    email;
    bookingId;
    driverName;
    pickupTime;
    pickupLocation;
    constructor(email, bookingId, driverName, pickupTime, pickupLocation) {
        this.email = email;
        this.bookingId = bookingId;
        this.driverName = driverName;
        this.pickupTime = pickupTime;
        this.pickupLocation = pickupLocation;
    }
}
exports.BookingConfirmationEmailEvent = BookingConfirmationEmailEvent;
class DriverVerificationEmailEvent {
    email;
    fullName;
    verificationStatus;
    reason;
    constructor(email, fullName, verificationStatus, reason) {
        this.email = email;
        this.fullName = fullName;
        this.verificationStatus = verificationStatus;
        this.reason = reason;
    }
}
exports.DriverVerificationEmailEvent = DriverVerificationEmailEvent;
class PasswordChangedEmailEvent {
    email;
    fullName;
    changedAt;
    constructor(email, fullName, changedAt) {
        this.email = email;
        this.fullName = fullName;
        this.changedAt = changedAt;
    }
}
exports.PasswordChangedEmailEvent = PasswordChangedEmailEvent;
//# sourceMappingURL=email.events.js.map