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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDriverService = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const email_event_service_1 = require("../../../services/mail/email-event.service");
const sms_event_service_1 = require("../../../services/sms/sms-event.service");
const token_service_1 = require("../../../services/token/token.service");
const password_util_1 = require("../../../utils/password.util");
const token_enum_1 = require("../../../enums/token.enum");
const moment_1 = __importDefault(require("moment"));
const login_type_enum_1 = require("../../../enums/login-type.enum");
const country_service_1 = require("../../countries/services/country.service");
const driver_repository_1 = require("../repositories/driver.repository");
const client_device_service_1 = require("../../client-devices/services/client-device.service");
const validators_utils_1 = require("../../../utils/validators.utils");
const utils_1 = require("../../../utils/utils");
const kyc_enums_1 = require("../../../enums/kyc.enums");
let AuthDriverService = class AuthDriverService {
    driverRepository;
    tokenService;
    emailEventService;
    smsEventService;
    countryService;
    clientDeviceService;
    constructor(driverRepository, tokenService, emailEventService, smsEventService, countryService, clientDeviceService) {
        this.driverRepository = driverRepository;
        this.tokenService = tokenService;
        this.emailEventService = emailEventService;
        this.smsEventService = smsEventService;
        this.countryService = countryService;
        this.clientDeviceService = clientDeviceService;
    }
    async signUpPhoneNo(input) {
        const existingUser = await this.driverRepository.findByPhone(input.phoneNo);
        if (existingUser) {
            throw new common_1.ConflictException('Driver with this phoneNo already exist');
        }
        const otpToken = await this.tokenService.generateOTPtoken({
            phoneNo: input.phoneNo,
            expiry: (0, moment_1.default)().add(10, 'minutes').toDate(),
            subject: token_enum_1.TokenSubject.SIGN_UP_PHONE,
        });
        await this.smsEventService.emitSignUpOtpSms(input.phoneNo, otpToken.token);
        return { otpToken: otpToken.token };
    }
    async signUpEmail(input) {
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const existingUser = await this.driverRepository.findByEmail(input.email);
        if (existingUser) {
            throw new common_1.ConflictException('Driver with this email already exist');
        }
        const expiryDate = (0, moment_1.default)().add(10, 'minutes').toDate();
        const otpToken = await this.tokenService.generateOTPtoken({
            email: input.email,
            expiry: expiryDate,
            subject: token_enum_1.TokenSubject.SIGN_UP_EMAIL,
        });
        await this.emailEventService.emitSignUpOtpEmail(input.email, otpToken.token, expiryDate.toISOString());
        return null;
    }
    async verifyOtp(input) {
        const data = await this.tokenService.validateOtp(input);
        if (!data) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        return data;
    }
    async createAccount(input) {
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const country = await this.countryService.findById(input.country);
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        const emailUser = await this.checkEmailExist(input.email);
        if (emailUser) {
            throw new common_1.ConflictException("User with email already exist");
        }
        const userPhone = await this.driverRepository.findByPhone(input.phoneNo);
        if (userPhone) {
            throw new common_1.ConflictException("User with phone number already exist");
        }
        const verifyPhoneOtp = await this.tokenService.verifySignUpOTP({
            phoneNo: input.phoneNo,
            token: input.otpPhone,
            subject: token_enum_1.TokenSubject.SIGN_UP_PHONE,
        });
        if (!verifyPhoneOtp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const verifyEmailOtp = await this.tokenService.verifySignUpOTP({
            email: input.email,
            token: input.otpEmail,
            subject: token_enum_1.TokenSubject.SIGN_UP_EMAIL,
        });
        if (!verifyEmailOtp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const password = await password_util_1.PasswordUtil.hashPassword(input.password);
        const user = await this.driverRepository.create({
            email: input.email,
            phoneNo: input.phoneNo,
            fullName: input.fullName,
            password: password,
            countryId: country.id,
            userType: user_type_enum_1.UserType.DRIVER,
            loginType: login_type_enum_1.LoginType.NORMAL,
            isEmailVerified: true,
            isPhoneVerified: true,
            isActive: true,
            gender: input.gender,
            isDisabled: false,
            kycCompleted: kyc_enums_1.KYC_COMPLETED.NOT_COMPLETED,
            isGuarantorCompleted: false,
        });
        const payload = {
            sub: user.id,
            userType: user_type_enum_1.UserType.DRIVER,
            userId: user.id,
            email: input.email
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        await this.emailEventService.emitWelcomeEmail(user.email, user.fullName);
        const data = {
            userId: user.id,
            email: input.email,
            userType: user_type_enum_1.UserType.DRIVER,
            id: user.id,
            token: token,
            isGuarantorCompleted: user.isGuarantorCompleted,
            kycCompleted: user.kycCompleted,
        };
        return data;
    }
    async login(input) {
        const { identity } = input;
        const identityType = utils_1.Utils.getLoginIdentityType(identity);
        let driver;
        if (identityType == user_type_enum_1.UserLoginIdentityType.EMAIL) {
            driver = await this.checkEmailExist(identity);
        }
        else {
            driver = await this.driverRepository.findByPhone(identity);
        }
        if (!driver) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        if (driver.loginType !== login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('login with email and password');
        }
        if (driver.isDisabled) {
            throw new common_1.NotFoundException('Your account is disabled, contact Admin');
        }
        if (!driver.isEmailVerified || !driver.isPhoneVerified) {
            throw new common_1.UnauthorizedException('Your account is not verified');
        }
        const verifyPassword = await password_util_1.PasswordUtil.verifyPassword(input.password, driver.password);
        if (!verifyPassword) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const clientDeviceToken = express_1.request.headers['x-client-device-token'];
        if (clientDeviceToken) {
            const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(driver.id, clientDeviceToken);
            if (!clientDevice) {
                const otpToken = await this.tokenService.generateOTPtoken({
                    email: driver.email,
                    expiry: (0, moment_1.default)().add(5, 'minutes').toDate(),
                    subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
                });
                await this.emailEventService.emitNewDeviceLoginOtpEmail(driver.email, otpToken.token);
                throw new common_1.UnauthorizedException('Detected new device login');
            }
        }
        const payload = {
            sub: driver.id,
            userType: driver.userType,
            userId: driver.id,
            email: driver.email
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        const { password, ...rest } = driver;
        const data = {
            id: driver.id,
            token,
            userType: driver.userType,
            userId: driver.id,
            email: driver.email,
            kycCompleted: driver.kycCompleted,
            isGuarantorCompleted: driver.isGuarantorCompleted
        };
        return data;
    }
    async loginOtp(input) {
        const { identity, otp, password, deviceInfo } = input;
        const user = await this.driverRepository.findByIdentity(identity);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.loginType !== login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('Only normal login type is allowed to login with OTP');
        }
        if (!user.isActive) {
            throw new common_1.NotFoundException('Your account is disabled, contact Admin');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Your email account is not verified');
        }
        if (!user.isPhoneVerified) {
            throw new common_1.UnauthorizedException('Your phone no. is not verified');
        }
        const verifyOtp = await this.tokenService.verifyOTP({
            email: user.email,
            token: otp,
            subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
        });
        if (!verifyOtp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const verifyPassword = await password_util_1.PasswordUtil.verifyPassword(password, user.password);
        if (!verifyPassword) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const payload = {
            sub: user.id,
            userType: user_type_enum_1.UserType.USER,
            userId: user.id,
            email: user.email
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        const loginTime = (0, moment_1.default)().format('MMMM Do YYYY, h:mm A');
        await this.emailEventService.emitNewLoginEmail(user.email, user.fullName, deviceInfo, loginTime);
        return {
            email: user.email,
            userType: user_type_enum_1.UserType.USER,
            id: user.id,
            token: token
        };
    }
    async forgotPassword(input) {
        input.email = input.email.toLowerCase();
        const user = await this.checkEmailExist(input.email);
        if (!user) {
            return null;
        }
        if (user.loginType !== login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('Only normal login type is allowed to reset password');
        }
        const expiry = (0, moment_1.default)().add(10, 'minutes').toDate();
        const otpToken = await this.tokenService.generateOTPtoken({
            email: input.email,
            expiry: expiry,
            subject: token_enum_1.TokenSubject.FORGOT_PASSWORD,
        });
        await this.emailEventService.emitForgetPasswordEmail(user.email, otpToken.token);
        return null;
    }
    async resetPassword(input) {
        const { confirmPassword, password, email, token } = input;
        input.email = input.email.toLowerCase();
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const tokenResult = await this.tokenService.verifyOTP({
            token: token,
            subject: token_enum_1.TokenSubject.FORGOT_PASSWORD,
            email: email,
        });
        if (!tokenResult) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const user = await this.checkEmailExist(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.loginType !== login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('Only normal login type is allowed to reset password');
        }
        await this.driverRepository.update(user.id, { password: await password_util_1.PasswordUtil.hashPassword(password) });
        return null;
    }
    async changePassword(input, authUser) {
        const user = await this.checkEmailExist(authUser.email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { confirmPassword, newPassword, oldPassword } = input;
        const verifyOldPass = await password_util_1.PasswordUtil.verifyPassword(oldPassword, user.password);
        if (!verifyOldPass) {
            throw new common_1.BadRequestException('Incorrect Old Password');
        }
        if (confirmPassword !== newPassword) {
            throw new common_1.BadRequestException('Password do not match');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hashPassword(newPassword);
        await this.driverRepository.update(user.id, { password: hashedPassword });
        const changedAt = (0, moment_1.default)().format('MMMM Do YYYY, h:mm A');
        await this.emailEventService.emitPasswordChangedEmail(user.email, user.fullName, changedAt);
        return null;
    }
    async checkEmailExist(email) {
        return await this.driverRepository.findByEmail(email);
    }
    getBaseUrlFromRequest(req) {
        const origin = req.get('origin') || req.get('referer');
        if (origin) {
            const url = new URL(origin);
            return `${url.protocol}//${url.host}`;
        }
        return process.env.PEPP_APP_CLIENT_URL || 'https://apps.peppcruise.com';
    }
};
exports.AuthDriverService = AuthDriverService;
exports.AuthDriverService = AuthDriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [driver_repository_1.DriverRepository,
        token_service_1.TokenService,
        email_event_service_1.EmailEventService,
        sms_event_service_1.SmsEventService,
        country_service_1.CountryService,
        client_device_service_1.ClientDeviceService])
], AuthDriverService);
//# sourceMappingURL=auth.driver.service.js.map