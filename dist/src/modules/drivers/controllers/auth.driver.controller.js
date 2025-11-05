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
exports.AuthDriverController = void 0;
const common_1 = require("@nestjs/common");
const auth_driver_dto_1 = require("../dto/auth.driver.dto");
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const auth_driver_service_1 = require("../services/auth.driver.service");
const auth_driver_dto_2 = require("../dto/auth.driver.dto");
let AuthDriverController = class AuthDriverController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUpPhoneNo(input) {
        return await this.authService.signUpPhoneNo(input);
    }
    async signUpEmail(input) {
        return await this.authService.signUpEmail(input);
    }
    async verifyOtp(input) {
        return await this.authService.verifyOtp(input);
    }
    async signUp(input) {
        return await this.authService.createAccount(input);
    }
    async login(input) {
        return await this.authService.login(input);
    }
    async loginOtp(input) {
        return await this.authService.loginOtp(input);
    }
    async forgotPassword(input, req) {
        return await this.authService.forgotPassword(input);
    }
    async resetPassword(input) {
        return await this.authService.resetPassword(input);
    }
    async changePassword(input, req) {
        return await this.authService.changePassword(input, req.user);
    }
};
exports.AuthDriverController = AuthDriverController;
__decorate([
    (0, common_1.Post)('signup-phone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.SignupPhone]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "signUpPhoneNo", null);
__decorate([
    (0, common_1.Post)('signup-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.SignupEmail]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "signUpEmail", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('create-account'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_2.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login-with-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.LoginOtpDto]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "loginOtp", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.ForgotPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Patch)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "resetPassword", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_driver_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthDriverController.prototype, "changePassword", null);
exports.AuthDriverController = AuthDriverController = __decorate([
    (0, common_1.Controller)('auth/driver'),
    __metadata("design:paramtypes", [auth_driver_service_1.AuthDriverService])
], AuthDriverController);
//# sourceMappingURL=auth.driver.controller.js.map