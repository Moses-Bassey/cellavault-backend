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
exports.PasscodeDriverController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passcode_service_1 = require("../../auth/services/passcode.service");
const passcode_dto_1 = require("../../auth/dto/passcode.dto");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const response_utils_1 = require("../../../utils/response.utils");
let PasscodeDriverController = class PasscodeDriverController {
    passcodeService;
    constructor(passcodeService) {
        this.passcodeService = passcodeService;
    }
    async createPasscode(input, req) {
        const data = await this.passcodeService.createPasscode(req.user.userId, req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({ id: data.id, userId: data.userId, userType: data.userType }, 'Passcode created successfully', common_1.HttpStatus.CREATED);
    }
    async updatePasscode(input, req) {
        const data = await this.passcodeService.changePasscode(req.user.userId, req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({ id: data.id, userId: data.userId, userType: data.userType }, 'Passcode updated successfully', common_1.HttpStatus.OK);
    }
    async getPasscode(req) {
        const data = await this.passcodeService.getPasscode(req.user.userId, req.user.userType);
        if (!data) {
            return response_utils_1.ResponseUtil.handleResponse({ hasPasscode: false }, 'No passcode set', common_1.HttpStatus.OK);
        }
        return response_utils_1.ResponseUtil.handleResponse({ hasPasscode: true, id: data.id }, 'Passcode found', common_1.HttpStatus.OK);
    }
    async verifyPasscode(input, req) {
        await this.passcodeService.verifyPasscode(req.user.userId, req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({ verified: true }, 'Passcode verified successfully', common_1.HttpStatus.OK);
    }
    async requestResetPasscode(req) {
        await this.passcodeService.requestResetPasscode(req.user.userId, req.user.userType, req.user.email);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Reset OTP has been sent to your email', common_1.HttpStatus.OK);
    }
    async resetPasscode(input, req) {
        await this.passcodeService.resetPasscode(req.user.userId, req.user.userType, req.user.email, input);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Passcode reset successfully', common_1.HttpStatus.OK);
    }
};
exports.PasscodeDriverController = PasscodeDriverController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create driver passcode' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Passcode created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Passcode already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.CreatePasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "createPasscode", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver passcode' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Passcode updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Passcode not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.CreatePasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "updatePasscode", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get driver passcode status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Passcode status retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "getPasscode", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify driver passcode' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Passcode verified successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid passcode',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Passcode not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.VerifyPasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "verifyPasscode", null);
__decorate([
    (0, common_1.Post)('reset-request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request driver passcode reset OTP' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reset OTP has been sent to your email',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Passcode not found',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "requestResetPasscode", null);
__decorate([
    (0, common_1.Post)('reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset driver passcode with OTP' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Passcode reset successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired OTP',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Passcode not found',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.ResetPasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeDriverController.prototype, "resetPasscode", null);
exports.PasscodeDriverController = PasscodeDriverController = __decorate([
    (0, swagger_1.ApiTags)('Driver Passcode'),
    (0, common_1.Controller)('driver/passcode'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [passcode_service_1.PasscodeService])
], PasscodeDriverController);
//# sourceMappingURL=passcode.driver.controller.js.map