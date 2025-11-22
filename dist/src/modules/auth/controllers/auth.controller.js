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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const auth_decorator_1 = require("../decorators/auth.decorator");
const auth_guard_1 = require("../guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const response_utils_1 = require("../../../utils/response.utils");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUpPhoneNo(input) {
        const data = await this.authService.signUpPhoneNo(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Sign up OTP has been sent to your phoneNo', common_1.HttpStatus.OK);
    }
    async signUpEmail(input) {
        const data = await this.authService.signUpEmail(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Sign up OTP has been sent to your email', common_1.HttpStatus.OK);
    }
    async verifyOtp(input) {
        const data = await this.authService.verifyOtp(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'OTP Validated successfully', common_1.HttpStatus.OK);
    }
    async verifyPasswordResetOtp(input) {
        const data = await this.authService.verifyPasswordResetOtp(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Password reset OTP Validated successfully', common_1.HttpStatus.OK);
    }
    async signUp(input) {
        const data = await this.authService.signUp(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User created successfully', common_1.HttpStatus.CREATED);
    }
    async login(input) {
        const data = await this.authService.login(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Login Successful', common_1.HttpStatus.OK);
    }
    async loginOtp(input) {
        const data = await this.authService.loginOtp(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Login successful', common_1.HttpStatus.OK);
    }
    async forgotPassword(input, req) {
        const data = await this.authService.forgotPassword(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Reset OTP has been sent to your email', common_1.HttpStatus.OK);
    }
    async resetPassword(input) {
        const data = await this.authService.resetPassword(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Password reset successful', common_1.HttpStatus.OK);
    }
    async changePassword(input, req) {
        const data = await this.authService.changePassword(input, req.user);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Password changed successfully', common_1.HttpStatus.OK);
    }
    async logout(input, req) {
        const data = await this.authService.logout(input, req.user);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Password changed successfully', common_1.HttpStatus.OK);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup-phone'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignupPhone]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpPhoneNo", null);
__decorate([
    (0, common_1.Post)('signup-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignupEmail]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpEmail", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('verify-password-reset-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPasswordResetOtp", null);
__decorate([
    (0, common_1.Post)('sign-up'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignUpUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login-with-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginOtp", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Patch)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map