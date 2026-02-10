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
exports.AuthAdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_dto_1 = require("../dto/admin.dto");
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const auth_admin_service_1 = require("../services/auth.admin.service");
const response_utils_1 = require("../../../utils/response.utils");
let AuthAdminController = class AuthAdminController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(input) {
        const data = await this.authService.create(input);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Account created successfully, please await feedback from us', common_1.HttpStatus.CREATED);
    }
    async login(input, request) {
        const data = await this.authService.login(input, request);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Login successful', common_1.HttpStatus.OK);
    }
    async loginOtp(input, request) {
        const data = await this.authService.loginOtp(input, request);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Login successful', common_1.HttpStatus.OK);
    }
    async delete(userCredentials) {
        const { email, password } = userCredentials;
        const data = await this.authService.deleteAdminAccount(email, password);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Admin account deleted successfully', common_1.HttpStatus.OK);
    }
};
exports.AuthAdminController = AuthAdminController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AuthAdminController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthAdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.LoginOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthAdminController.prototype, "loginOtp", null);
__decorate([
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthAdminController.prototype, "delete", null);
exports.AuthAdminController = AuthAdminController = __decorate([
    (0, common_1.Controller)('auth/admin'),
    __metadata("design:paramtypes", [auth_admin_service_1.AuthAdminService])
], AuthAdminController);
//# sourceMappingURL=auth.admin.controller.js.map