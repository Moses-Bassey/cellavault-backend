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
var SmsEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const sms_service_1 = require("../sms.service");
const sms_events_1 = require("../events/sms.events");
let SmsEventListener = SmsEventListener_1 = class SmsEventListener {
    smsService;
    logger = new common_1.Logger(SmsEventListener_1.name);
    constructor(smsService) {
        this.smsService = smsService;
    }
    async handleSignUpOtpEvent(event) {
        try {
            this.logger.log(`Sending signup OTP SMS to ${event.phoneNumber}`);
            await this.smsService.sendOtp(event.phoneNumber, event.otpCode);
            this.logger.log(`Signup OTP SMS sent successfully to ${event.phoneNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to send signup OTP SMS to ${event.phoneNumber}:`, error);
        }
    }
    async handleForgotPasswordOtpEvent(event) {
        try {
            this.logger.log(`Sending forgot password OTP SMS to ${event.phoneNumber}`);
            await this.smsService.sendOtp(event.phoneNumber, event.otpCode);
            this.logger.log(`Forgot password OTP SMS sent successfully to ${event.phoneNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to send forgot password OTP SMS to ${event.phoneNumber}:`, error);
        }
    }
};
exports.SmsEventListener = SmsEventListener;
__decorate([
    (0, event_emitter_1.OnEvent)('sms.signup-otp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_events_1.SignUpOtpSmsEvent]),
    __metadata("design:returntype", Promise)
], SmsEventListener.prototype, "handleSignUpOtpEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('sms.forgot-password-otp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_events_1.ForgotPasswordOtpSmsEvent]),
    __metadata("design:returntype", Promise)
], SmsEventListener.prototype, "handleForgotPasswordOtpEvent", null);
exports.SmsEventListener = SmsEventListener = SmsEventListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsEventListener);
//# sourceMappingURL=sms.listener.js.map