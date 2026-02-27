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
exports.PasscodeService = void 0;
const common_1 = require("@nestjs/common");
const passcode_repository_1 = require("../repositories/passcode.repository");
const password_util_1 = require("../../../utils/password.util");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const user_repository_1 = require("../../users/repositories/user.repository");
const driver_repository_1 = require("../../drivers/repositories/driver.repository");
const token_service_1 = require("../../../services/token/token.service");
const email_event_service_1 = require("../../../services/mail/email-event.service");
const token_enum_1 = require("../../../enums/token.enum");
const moment_1 = __importDefault(require("moment"));
let PasscodeService = class PasscodeService {
    passcodeRepository;
    userRepository;
    driverRepository;
    tokenService;
    emailEventService;
    constructor(passcodeRepository, userRepository, driverRepository, tokenService, emailEventService) {
        this.passcodeRepository = passcodeRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.tokenService = tokenService;
        this.emailEventService = emailEventService;
    }
    async createPasscode(userId, userType, input) {
        const existingPasscode = await this.passcodeRepository.findByUserId(userId, userType);
        if (existingPasscode) {
            throw new common_1.ConflictException('Passcode already exists. Change passcode or reset code.');
        }
        const hashedCode = await password_util_1.PasswordUtil.hashPassword(input.code);
        const passcode = await this.passcodeRepository.create({
            userId,
            userType,
            code: hashedCode,
        });
        if (userType === user_type_enum_1.UserType.DRIVER) {
        }
        else {
            await this.userRepository.update(userId, { hasPasscode: true });
        }
        return passcode;
    }
    async changePasscode(userId, userType, input) {
        const existingPasscode = await this.passcodeRepository.findByUserId(userId, userType);
        if (!existingPasscode) {
            throw new common_1.NotFoundException('Passcode not found. Please create a passcode first.');
        }
        const isValid = await password_util_1.PasswordUtil.verifyPassword(input.oldPasscode, existingPasscode.code);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid old passcode');
        }
        const hashedCode = await password_util_1.PasswordUtil.hashPassword(input.newPassCode);
        await this.passcodeRepository.update(userId, userType, {
            code: hashedCode,
        });
        if (userType === user_type_enum_1.UserType.DRIVER) {
        }
        else {
            await this.userRepository.update(userId, { hasPasscode: true });
        }
        return null;
    }
    async getPasscode(userId, userType) {
        return await this.passcodeRepository.findByUserId(userId, userType);
    }
    async verifyPasscode(userId, userType, input) {
        const passcode = await this.passcodeRepository.findByUserId(userId, userType);
        if (!passcode) {
            throw new common_1.NotFoundException('Passcode not found. Please set a passcode first.');
        }
        const isValid = await password_util_1.PasswordUtil.verifyPassword(input.code, passcode.code);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid passcode');
        }
        return true;
    }
    async requestResetPasscode(userId, userType) {
        const passcode = await this.passcodeRepository.findByUserId(userId, userType);
        if (!passcode) {
            throw new common_1.NotFoundException('Passcode not found. Please create a passcode first.');
        }
        let email;
        if (userType === user_type_enum_1.UserType.DRIVER) {
            const driver = await this.driverRepository.findById(userId);
            if (!driver) {
                throw new common_1.NotFoundException('Driver not found');
            }
            email = driver.email;
        }
        else {
            const user = await this.userRepository.findById(userId);
            console.log(user);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            email = user.email;
        }
        const expiry = (0, moment_1.default)().add(10, 'minutes').toDate();
        const otpToken = await this.tokenService.generateOTPtoken({
            email: email,
            expiry: expiry,
            subject: token_enum_1.TokenSubject.RESET_PASSCODE,
        });
        await this.emailEventService.emitForgetPasswordEmail(email, otpToken.token);
        return null;
    }
    async resetPasscode(userId, userType, email, input) {
        if (input.newCode !== input.confirmCode) {
            throw new common_1.BadRequestException('New passcode and confirm passcode do not match');
        }
        const passcode = await this.passcodeRepository.findByUserId(userId, userType);
        if (!passcode) {
            throw new common_1.NotFoundException('Passcode not found. Please create a passcode first.');
        }
        const tokenResult = await this.tokenService.verifyOTP({
            token: input.otp,
            subject: token_enum_1.TokenSubject.RESET_PASSCODE,
            email: email,
        });
        if (!tokenResult) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const hashedCode = await password_util_1.PasswordUtil.hashPassword(input.newCode);
        await this.passcodeRepository.update(userId, userType, {
            code: hashedCode,
        });
        const updatedPasscode = await this.passcodeRepository.findByUserId(userId, userType);
        if (!updatedPasscode) {
            throw new common_1.NotFoundException('Passcode not found after reset.');
        }
        return updatedPasscode;
    }
};
exports.PasscodeService = PasscodeService;
exports.PasscodeService = PasscodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [passcode_repository_1.PasscodeRepository,
        user_repository_1.UserRepository,
        driver_repository_1.DriverRepository,
        token_service_1.TokenService,
        email_event_service_1.EmailEventService])
], PasscodeService);
//# sourceMappingURL=passcode.service.js.map