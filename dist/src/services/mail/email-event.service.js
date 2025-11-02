"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEventService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_events_1 = require("./events/email.events");
let EmailEventService = class EmailEventService {
    eventEmitter;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    async emitSignUpOtpEmail(email, otpCode, expiryDate) {
        const event = new email_events_1.SignUpOtpEmailEvent(email, otpCode, expiryDate);
        this.eventEmitter.emit('email.signup-otp', event);
    }
    async emitForgetPasswordEmail(email, otp) {
        const event = new email_events_1.ForgetPasswordEmailEvent(email, otp);
        this.eventEmitter.emit('email.forget-password', event);
    }
    async emitWelcomeEmail(email, fullName) {
        const event = new email_events_1.WelcomeEmailEvent(email, fullName);
        this.eventEmitter.emit('email.welcome', event);
    }
    async emitBookingConfirmationEmail(email, bookingId, driverName, pickupTime, pickupLocation) {
        const event = new email_events_1.BookingConfirmationEmailEvent(email, bookingId, driverName, pickupTime, pickupLocation);
        this.eventEmitter.emit('email.booking-confirmation', event);
    }
    async emitDriverVerificationEmail(email, fullName, verificationStatus, reason) {
        const event = new email_events_1.DriverVerificationEmailEvent(email, fullName, verificationStatus, reason);
        this.eventEmitter.emit('email.driver-verification', event);
    }
    async emitPasswordChangedEmail(email, fullName, changedAt) {
        const event = new email_events_1.PasswordChangedEmailEvent(email, fullName, changedAt);
        this.eventEmitter.emit('email.password-changed', event);
    }
    async emitNewLoginEmail(email, fullName, deviceInfo, loginTime, ipAddress) {
        const event = new email_events_1.NewLoginEmailEvent(email, fullName, deviceInfo, loginTime, ipAddress);
        this.eventEmitter.emit('email.new-login', event);
    }
    async emitNewDeviceLoginOtpEmail(email, otpCode) {
        const event = new email_events_1.NewDeviceLoginOtpEmailEvent(email, otpCode);
        this.eventEmitter.emit('email.new-device-login-otp', event);
    }
};
exports.EmailEventService = EmailEventService;
exports.EmailEventService = EmailEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], EmailEventService);
//# sourceMappingURL=email-event.service.js.map