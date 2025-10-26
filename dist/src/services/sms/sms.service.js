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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
let SmsService = SmsService_1 = class SmsService {
    configService;
    logger = new common_1.Logger(SmsService_1.name);
    client;
    fromNumber;
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('app.twilioAccountSid');
        const authToken = this.configService.get('app.twilioAuthToken');
        this.fromNumber = this.configService.get('app.twilioFromNumber') || '';
        if (!accountSid || !authToken) {
            this.logger.warn('Twilio credentials not configured. SMS functionality will be limited.');
            this.client = null;
        }
        else {
            this.client = new twilio_1.Twilio(accountSid, authToken);
            this.logger.log('Twilio SMS service initialized');
        }
    }
    async sendOtp(phoneNumber, otpCode, message) {
        if (!this.client) {
            this.logger.error('Twilio client not initialized. Cannot send SMS.');
            throw new Error('SMS service not configured');
        }
        const smsMessage = message || `Your PeppCruise verification code is: ${otpCode}. Valid for 10 minutes.`;
        try {
            const result = await this.client.messages.create({
                body: smsMessage,
                from: this.fromNumber,
                to: phoneNumber,
            });
            this.logger.log(`SMS sent successfully to ${phoneNumber}. SID: ${result.sid}`);
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${phoneNumber}:`, error);
            throw error;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map