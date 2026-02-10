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
var AuthAdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const token_service_1 = require("../../../services/token/token.service");
const token_enum_1 = require("../../../enums/token.enum");
const admin_repository_1 = require("../repositories/admin.repository");
const client_device_service_1 = require("../../client-devices/services/client-device.service");
const client_device_emitter_1 = require("../../client-devices/emitters/client-device.emitter");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const email_event_service_1 = require("../../../services/mail/email-event.service");
const password_util_1 = require("../../../utils/password.util");
const validators_utils_1 = require("../../../utils/validators.utils");
let AuthAdminService = AuthAdminService_1 = class AuthAdminService {
    adminRepository;
    clientDeviceService;
    emailEventService;
    tokenService;
    clientDeviceEventEmitter;
    logger = new common_1.Logger(AuthAdminService_1.name);
    constructor(adminRepository, clientDeviceService, emailEventService, tokenService, clientDeviceEventEmitter) {
        this.adminRepository = adminRepository;
        this.clientDeviceService = clientDeviceService;
        this.emailEventService = emailEventService;
        this.tokenService = tokenService;
        this.clientDeviceEventEmitter = clientDeviceEventEmitter;
    }
    async create(data) {
        data.email = validators_utils_1.Validators.validateEmail(data.email);
        const emailUser = await this.checkEmailExist(data.email);
        if (emailUser) {
            throw new common_1.ConflictException('Admin with email already exists');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hashPassword(data.password);
        const admin = await this.adminRepository.create({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: user_type_enum_1.UserType.PEPP_ADMIN,
        });
        return admin;
    }
    async login(data, request) {
        const { email, password } = data;
        const admin = await this.checkEmailExist(email);
        if (!admin) {
            throw new common_1.NotFoundException('Account not found');
        }
        if (!admin.isVerified || !admin.isActive) {
            throw new common_1.UnauthorizedException('Account creation request not approved, please contact support team.');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.verifyPassword(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const clientDeviceToken = request.headers['x-client-device-token'];
        console.log('clientDeviceToken:', clientDeviceToken);
        if (clientDeviceToken) {
            await this.validateClientDevice(admin, clientDeviceToken);
        }
        return this.buildLoginResponse(admin);
    }
    async loginOtp(input, request) {
        const { email, otp, password, deviceInfo } = input;
        const admin = await this.checkEmailExist(email);
        if (!admin)
            throw new common_1.NotFoundException('Account not found');
        const verifyOtp = await this.tokenService.verifyOTP({
            email: admin.email,
            token: otp,
            subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
        });
        if (!verifyOtp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const verifyPassword = await password_util_1.PasswordUtil.verifyPassword(password, admin.password);
        if (!verifyPassword) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const payload = {
            sub: admin.id,
            adminType: admin.role,
            adminId: admin.id,
            email: admin.email,
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        const loginTime = (0, moment_1.default)().format('MMMM Do YYYY, h:mm A');
        this.emailEventService.emitNewLoginEmail(admin.email, admin.fullName, deviceInfo.name || 'Unknown Device', loginTime);
        const ipAddress = this.getClientIp(request);
        this.clientDeviceEventEmitter.emitAddDeviceToken({
            adminId: admin.id,
            ipAddress: ipAddress ?? 'Unknown IP',
            deviceFCMToken: deviceInfo.deviceFCMToken || null,
            name: deviceInfo.name || null,
            userType: admin.role,
        });
        return {
            email: admin.email,
            adminType: payload.adminType,
            id: admin.id,
            token: token,
        };
    }
    async deleteAdminAccount(email, password) {
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const verifyPassword = await password_util_1.PasswordUtil.verifyPassword(password, admin.password);
        if (!verifyPassword)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const newEmail = `${admin.email}-${admin.id}`;
        const updatedAdmin = await this.adminRepository.update(admin.id, {
            email: newEmail,
        });
        if (!updatedAdmin)
            throw new common_1.NotFoundException('Admin not found after deletion');
        const deletedCount = await this.adminRepository.delete(admin.id);
        if (deletedCount == 0) {
            this.logger.warn(`Admin id=${admin.id} not deleted`);
            throw new common_1.BadRequestException('Failed to delete');
        }
        this.logger.log(`Admin id=${admin.id} deleted`);
        return null;
    }
    async checkEmailExist(email) {
        return await this.adminRepository.findByEmail(email);
    }
    async validateClientDevice(admin, clientDeviceToken) {
        const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(admin.id, clientDeviceToken);
        console.log('Client device: ', clientDevice, 'Id: ', admin.id);
        if (clientDevice)
            return;
        const otpToken = await this.tokenService.generateOTPtoken({
            email: admin.email,
            expiry: (0, moment_1.default)().add(5, 'minutes').toDate(),
            subject: token_enum_1.TokenSubject.NEW_DEVICE_LOGIN_OTP,
        });
        await this.emailEventService.emitNewDeviceLoginOtpEmail(admin.email, otpToken.token);
        throw new common_1.UnauthorizedException('Detected new device login');
    }
    async buildLoginResponse(admin) {
        const payload = {
            sub: admin.id,
            userId: admin.id,
            email: admin.email,
            userType: admin.role,
        };
        const token = await this.tokenService.generateJWTtoken(payload);
        return {
            id: admin.id,
            adminId: admin.id,
            adminType: admin.role,
            email: admin.email,
            token,
        };
    }
    getClientIp(request) {
        const forwarded = request.headers['x-forwarded-for'];
        let ipAddress;
        if (forwarded) {
            ipAddress = Array.isArray(forwarded)
                ? forwarded[0]
                : forwarded.split(',')[0].trim();
        }
        if (!ipAddress && 'socket' in request && request.socket) {
            ipAddress = request.socket.remoteAddress ?? undefined;
        }
        if (ipAddress?.startsWith('::ffff:')) {
            ipAddress = ipAddress.replace('::ffff:', '');
        }
        return ipAddress;
    }
};
exports.AuthAdminService = AuthAdminService;
exports.AuthAdminService = AuthAdminService = AuthAdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository,
        client_device_service_1.ClientDeviceService,
        email_event_service_1.EmailEventService,
        token_service_1.TokenService,
        client_device_emitter_1.ClientDeviceEventEmitter])
], AuthAdminService);
//# sourceMappingURL=auth.admin.service.js.map