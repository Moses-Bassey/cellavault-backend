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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const user_type_enum_1 = require("../../enums/user-type.enum");
const mail_service_1 = require("../../services/mail/mail.service");
const email_event_service_1 = require("../../services/mail/email-event.service");
const sms_event_service_1 = require("../../services/sms/sms-event.service");
const token_service_1 = require("../../services/token/token.service");
const password_util_1 = require("../../utils/password.util");
const user_repository_1 = require("../users/repositories/user.repository");
const token_enum_1 = require("../../enums/token.enum");
const moment_1 = __importDefault(require("moment"));
const login_type_enum_1 = require("../../enums/login-type.enum");
const country_service_1 = require("../countries/services/country.service");
const user_service_1 = require("../users/services/user.service");
const client_device_service_1 = require("../client-devices/services/client-device.service");
const validators_utils_1 = require("../../utils/validators.utils");
const utils_1 = require("../../utils/utils");
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
    async signUpPhoneNo(input) {
        const { country, phoneNo } = input;
        const existingCountry = await this.countryService.findById(country);
        if (!existingCountry) {
            throw new common_1.ConflictException('Country code not found!');
        }
        const phone = utils_1.Utils.normalizeCountryPhone(existingCountry.phoneCode, phoneNo, existingCountry.phoneLength);
        const existingUser = await this.userRepository.findByPhone(phone);
        if (existingUser) {
            throw new common_1.ConflictException('User with this phoneNo already exist');
        }
        const otpToken = await this.tokenService.generateOTPtoken({
            phoneNo: phone,
            expiry: (0, moment_1.default)().add(10, 'minutes').toDate(),
            subject: token_enum_1.TokenSubject.SIGN_UP_PHONE,
        });
        await this.smsEventService.emitSignUpOtpSms(utils_1.Utils.phoneSMSFormat(phone), otpToken.token);
        {
            otpToken: otpToken.token;
        }
    }
    async signUpEmail(input) {
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exist');
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
        const { token, subject, email, phoneNo, country } = input;
        let data;
        if (subject === token_enum_1.TokenSubject.SIGN_UP_EMAIL) {
            input.email = validators_utils_1.Validators.validateEmail(input.email);
            data = await this.tokenService.validateOtp({ token, subject, email, phoneNo });
        }
        else {
            if (!country) {
                throw new common_1.BadRequestException('Must provide a valid country!');
            }
            const existingCountry = await this.countryService.findById(country);
            if (!existingCountry) {
                throw new common_1.ConflictException('Country code not found!');
            }
            const phone = utils_1.Utils.normalizeCountryPhone(existingCountry.phoneCode, phoneNo, existingCountry.phoneLength);
            data = await this.tokenService.validateOtp({
                token, subject, phoneNo: phone
            });
        }
        if (!data) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        return input;
    }
    async verifyPasswordResetOtp(input) {
        const { token, subject, email } = input;
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const data = await this.tokenService.validatePasswordResetOtp({ token, subject, email });
        if (!data) {
            throw new common_1.BadRequestException('Invalid Password Reset OTP');
        }
        return input;
    }
    async signUp(input) {
        const country = await this.countryService.findById(input.country);
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const emailUser = await this.checkEmailExist(input.email);
        if (emailUser) {
            throw new common_1.ConflictException("User with email already exist");
        }
        if (!input.country) {
            throw new common_1.BadRequestException('Must provide a valid country!');
        }
        const existingCountry = await this.countryService.findById(input.country);
        if (!existingCountry) {
            throw new common_1.ConflictException('Country code not found!');
        }
        const phone = utils_1.Utils.normalizeCountryPhone(existingCountry.phoneCode, input.phoneNo, existingCountry.phoneLength);
        const verifyPhoneOtp = await this.tokenService.verifySignUpOTP({
            phoneNo: phone,
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
        const user = await this.userRepository.create({
            email: input.email,
            phoneNo: phone,
            fullName: input.fullName,
            password: password,
            countryId: country.id,
            userType: user_type_enum_1.UserType.USER,
            loginType: login_type_enum_1.LoginType.NORMAL,
            isEmailVerified: true,
            isPhoneVerified: true,
            isActive: true,
        });
        const payload = {
            sub: user.id,
            userType: user_type_enum_1.UserType.USER,
            userId: user.id,
            email: input.email
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        await this.emailEventService.emitWelcomeEmail(user.email, user.fullName);
        return {
            email: input.email,
            userType: user_type_enum_1.UserType.USER,
            id: user.id,
            token: token
        };
    }
    async signUpSocial(input) {
        const country = await this.countryService.findById(input.country);
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        input.email = validators_utils_1.Validators.validateEmail(input.email);
        const emailUser = await this.checkEmailExist(input.email);
        if (emailUser) {
            throw new common_1.ConflictException("User with email already exist");
        }
        if (!input.country) {
            throw new common_1.BadRequestException('Must provide a valid country!');
        }
        const existingCountry = await this.countryService.findById(input.country);
        if (!existingCountry) {
            throw new common_1.ConflictException('Country code not found!');
        }
        const phone = utils_1.Utils.normalizeCountryPhone(existingCountry.phoneCode, input.phoneNo, existingCountry.phoneLength);
        const verifyPhoneOtp = await this.tokenService.verifySignUpOTP({
            phoneNo: phone,
            token: input.otpPhone,
            subject: token_enum_1.TokenSubject.SIGN_UP_PHONE,
        });
        if (!verifyPhoneOtp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const password = await password_util_1.PasswordUtil.hashPassword(input.password);
        const user = await this.userRepository.create({
            email: input.email,
            phoneNo: phone,
            fullName: input.fullName,
            password: password,
            countryId: country.id,
            userType: user_type_enum_1.UserType.USER,
            loginType: input.loginType,
            isEmailVerified: true,
            isPhoneVerified: true,
            isActive: true,
        });
        const payload = {
            sub: user.id,
            userType: user_type_enum_1.UserType.USER,
            userId: user.id,
            email: input.email
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        await this.emailEventService.emitWelcomeEmail(user.email, user.fullName);
        return {
            email: input.email,
            userType: user_type_enum_1.UserType.USER,
            id: user.id,
            token: token
        };
    }
    async login(input) {
        const { identity, country } = input;
        const identityType = utils_1.Utils.getLoginIdentityType(identity);
        let user;
        if (identityType == user_type_enum_1.UserLoginIdentityType.EMAIL) {
            user = await this.checkEmailExist(validators_utils_1.Validators.validateEmail(identity));
        }
        else {
            if (!country) {
                throw new common_1.BadRequestException('Must select a valid phone county');
            }
            const existingCountry = await this.countryService.findById(country);
            if (!existingCountry) {
                throw new common_1.NotFoundException('Country phone not found!');
            }
            const phoneNo = utils_1.Utils.normalizeCountryPhone(existingCountry?.phoneCode, identity, existingCountry.phoneLength);
            user = await this.userRepository.findByPhone(phoneNo);
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        if (user.loginType !== login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('login with email and password');
        }
        if (user.isDisabled) {
            throw new common_1.NotFoundException('Your account is disabled, contact Admin');
        }
        if (!user.isEmailVerified || !user.isPhoneVerified) {
            throw new common_1.UnauthorizedException('Your account is not verified');
        }
        const verifyPassword = await password_util_1.PasswordUtil.verifyPassword(input.password, user.password);
        if (!verifyPassword) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const clientDeviceToken = express_1.request.headers['x-client-device-token'];
        if (clientDeviceToken) {
            const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(user.id, clientDeviceToken);
            if (!clientDevice) {
                const otpToken = await this.tokenService.generateOTPtoken({
                    email: user.email,
                    expiry: (0, moment_1.default)().add(10, 'minutes').toDate(),
                    subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
                });
                await this.emailEventService.emitNewDeviceLoginOtpEmail(user.email, otpToken.token);
                throw new common_1.UnauthorizedException('Detected new device login');
            }
        }
        const payload = {
            sub: user.id,
            userType: user.userType,
            userId: user.id,
            email: user.email,
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        const { password, ...rest } = user;
        const data = {
            id: user.id,
            token,
            userType: user.userType,
            userId: user.id,
            email: user.email,
        };
        return data;
    }
    async loginSocial(input) {
        const { identity } = input;
        let user;
        user = await this.checkEmailExist(validators_utils_1.Validators.validateEmail(identity));
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        if (user.loginType == login_type_enum_1.LoginType.NORMAL) {
            throw new common_1.BadRequestException('login with email/phone and password');
        }
        if (user.isDisabled) {
            throw new common_1.NotFoundException('Your account is disabled, contact Admin');
        }
        if (!user.isEmailVerified || !user.isPhoneVerified) {
            throw new common_1.UnauthorizedException('Your account is not verified');
        }
        const clientDeviceToken = express_1.request.headers['x-client-device-token'];
        if (clientDeviceToken) {
            const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(user.id, clientDeviceToken);
            if (!clientDevice) {
                const otpToken = await this.tokenService.generateOTPtoken({
                    email: user.email,
                    expiry: (0, moment_1.default)().add(10, 'minutes').toDate(),
                    subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
                });
                await this.emailEventService.emitNewDeviceLoginOtpEmail(user.email, otpToken.token);
                throw new common_1.UnauthorizedException('Detected new device login');
            }
        }
        const payload = {
            sub: user.id,
            userType: user.userType,
            userId: user.id,
            email: user.email,
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        const { password, ...rest } = user;
        const data = {
            id: user.id,
            token,
            userType: user.userType,
            userId: user.id,
            email: user.email,
        };
        return data;
    }
    async loginOtp(input) {
        const { identity, otp, deviceInfo, country } = input;
        let user = null;
        const identityType = utils_1.Utils.getLoginIdentityType(identity);
        if (identityType == user_type_enum_1.UserLoginIdentityType.EMAIL) {
            user = await this.userService.findByIdentity(validators_utils_1.Validators.validateEmail(identity));
        }
        else {
            if (!country) {
                throw new common_1.BadRequestException('Must select a valid phone county');
            }
            const existingCountry = await this.countryService.findById(country);
            if (!existingCountry) {
                throw new common_1.NotFoundException('Country phone not found!');
            }
            const phoneNo = utils_1.Utils.normalizeCountryPhone(existingCountry?.phoneCode, identity, existingCountry.phoneLength);
            user = await this.userRepository.findByPhone(phoneNo);
        }
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
        input.email = validators_utils_1.Validators.validateEmail(input.email);
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
        let { confirmPassword, password, email, token } = input;
        email = validators_utils_1.Validators.validateEmail(email);
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
        await this.userService.update(user.id, { password: await password_util_1.PasswordUtil.hashPassword(password) });
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
        await this.userRepository.update(user.id, { password: hashedPassword });
        const changedAt = (0, moment_1.default)().format('MMMM Do YYYY, h:mm A');
        await this.emailEventService.emitPasswordChangedEmail(user.email, user.fullName, changedAt);
        return null;
    }
    async checkEmailExist(email) {
        return await this.userRepository.findByEmail(email);
    }
    getBaseUrlFromRequest(req) {
        const origin = req.get('origin') || req.get('referer');
        if (origin) {
            const url = new URL(origin);
            return `${url.protocol}//${url.host}`;
        }
        return process.env.PEPP_APP_CLIENT_URL || 'https://apps.peppcruise.com';
    }
    async logout(input, userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return null;
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