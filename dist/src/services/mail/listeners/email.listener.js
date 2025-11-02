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
var EmailEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_constants_1 = require("../mail.constants");
const email_events_1 = require("../events/email.events");
let EmailEventListener = EmailEventListener_1 = class EmailEventListener {
    mailerService;
    logger = new common_1.Logger(EmailEventListener_1.name);
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async handleSignUpOtpEvent(event) {
        try {
            this.logger.log(`Sending signup OTP email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.SIGN_UP_OTP,
                template: 'sign-up-otp',
                context: {
                    otpCode: event.otpCode,
                    expiryDate: event.expiryDate
                },
            });
            this.logger.log(`Signup OTP email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send signup OTP email to ${event.email}:`, error);
        }
    }
    async handleForgetPasswordEvent(event) {
        try {
            this.logger.log(`Sending forget password email to ${event.otpCode}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.FORGET_PASSWORD,
                template: 'forget-password',
                context: { otpCode: event.otpCode },
            });
            this.logger.log(`Forget password email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send forget password email to ${event.email}:`, error);
        }
    }
    async handleWelcomeEvent(event) {
        try {
            this.logger.log(`Sending welcome email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.WELCOME,
                template: 'welcome',
                context: {
                    fullName: event.fullName,
                    email: event.email
                },
            });
            this.logger.log(`Welcome email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${event.email}:`, error);
        }
    }
    async handleBookingConfirmationEvent(event) {
        try {
            this.logger.log(`Sending booking confirmation email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.BOOKING_CONFIRMATION,
                template: 'booking-confirmation',
                context: {
                    bookingId: event.bookingId,
                    driverName: event.driverName,
                    pickupTime: event.pickupTime,
                    pickupLocation: event.pickupLocation,
                },
            });
            this.logger.log(`Booking confirmation email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send booking confirmation email to ${event.email}:`, error);
        }
    }
    async handleDriverVerificationEvent(event) {
        try {
            this.logger.log(`Sending driver verification email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.DRIVER_VERIFICATION,
                template: 'driver-verification',
                context: {
                    fullName: event.fullName,
                    verificationStatus: event.verificationStatus,
                    reason: event.reason,
                },
            });
            this.logger.log(`Driver verification email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send driver verification email to ${event.email}:`, error);
        }
    }
    async handlePasswordChangedEvent(event) {
        try {
            this.logger.log(`Sending password changed email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.PASSWORD_CHANGED,
                template: 'password-changed',
                context: {
                    fullName: event.fullName,
                    email: event.email,
                    changedAt: event.changedAt,
                },
            });
            this.logger.log(`Password changed email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password changed email to ${event.email}:`, error);
        }
    }
    async handleNewLoginEvent(event) {
        try {
            this.logger.log(`Sending new login email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.NEW_LOGIN,
                template: 'new-login',
                context: {
                    fullName: event.fullName,
                    email: event.email,
                    deviceInfo: event.deviceInfo,
                    loginTime: event.loginTime,
                    ipAddress: event.ipAddress,
                },
            });
            this.logger.log(`New login email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send new login email to ${event.email}:`, error);
        }
    }
    async handleNewDeviceLoginOtpEvent(event) {
        try {
            this.logger.log(`Sending new device login OTP email to ${event.email}`);
            await this.mailerService.sendMail({
                to: event.email,
                subject: mail_constants_1.MAIL_SUBJECT.NEW_DEVICE_LOGIN_OTP,
                template: 'new-device-login',
                context: {
                    otpCode: event.otpCode,
                },
            });
            this.logger.log(`New device login OTP email sent successfully to ${event.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send new device login OTP email to ${event.email}:`, error);
        }
    }
};
exports.EmailEventListener = EmailEventListener;
__decorate([
    (0, event_emitter_1.OnEvent)('email.signup-otp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.SignUpOtpEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleSignUpOtpEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.forget-password'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.ForgetPasswordEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleForgetPasswordEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.welcome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.WelcomeEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleWelcomeEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.booking-confirmation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.BookingConfirmationEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleBookingConfirmationEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.driver-verification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.DriverVerificationEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleDriverVerificationEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.password-changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.PasswordChangedEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handlePasswordChangedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.new-login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.NewLoginEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleNewLoginEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('email.new-device-login-otp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_events_1.NewDeviceLoginOtpEmailEvent]),
    __metadata("design:returntype", Promise)
], EmailEventListener.prototype, "handleNewDeviceLoginOtpEvent", null);
exports.EmailEventListener = EmailEventListener = EmailEventListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailEventListener);
//# sourceMappingURL=email.listener.js.map