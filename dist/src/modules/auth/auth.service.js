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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../../services/mail/mail.service");
const email_event_service_1 = require("../../services/mail/email-event.service");
const sms_event_service_1 = require("../../services/sms/sms-event.service");
const token_service_1 = require("../../services/token/token.service");
const user_repository_1 = require("../users/repositories/user.repository");
const country_service_1 = require("../countries/services/country.service");
const user_service_1 = require("../users/services/user.service");
const client_device_service_1 = require("../client-devices/services/client-device.service");
let AuthService = class AuthService {
    userRepository;
    mailService;
    tokenService;
    emailEventService;
    smsEventService;
    countryService;
    userService;
    clientDeviceService;
    constructor(userRepository, mailService, tokenService, emailEventService, smsEventService, countryService, userService, clientDeviceService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.tokenService = tokenService;
        this.emailEventService = emailEventService;
        this.smsEventService = smsEventService;
        this.countryService = countryService;
        this.userService = userService;
        this.clientDeviceService = clientDeviceService;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        mail_service_1.MailService,
        token_service_1.TokenService,
        email_event_service_1.EmailEventService,
        sms_event_service_1.SmsEventService,
        country_service_1.CountryService,
        user_service_1.UserService,
        client_device_service_1.ClientDeviceService])
], AuthService);
//# sourceMappingURL=auth.service.js.map