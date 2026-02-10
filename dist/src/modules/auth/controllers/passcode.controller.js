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
exports.PasscodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passcode_service_1 = require("../services/passcode.service");
const passcode_dto_1 = require("../dto/passcode.dto");
const auth_guard_1 = require("../guards/auth.guard");
const auth_decorator_1 = require("../decorators/auth.decorator");
const response_utils_1 = require("../../../utils/response.utils");
const validators_utils_1 = require("../../../utils/validators.utils");
let PasscodeController = class PasscodeController {
    passcodeService;
    constructor(passcodeService) {
        this.passcodeService = passcodeService;
    }
    async createPasscode(input, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.passcodeService.createPasscode(userId, req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Passcode created successfully', common_1.HttpStatus.CREATED);
    }
    async changePasscode(input, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.passcodeService.changePasscode(validators_utils_1.Validators.validateUuid(req.user.userId), req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Passcode updated successfully', common_1.HttpStatus.OK);
    }
    async verifyPasscode(input, req) {
        const data = await this.passcodeService.verifyPasscode(req.user.userId, req.user.userType, input);
        return response_utils_1.ResponseUtil.handleResponse({ verified: true }, 'Passcode verified successfully', common_1.HttpStatus.OK);
    }
    async requestResetPasscode(req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        await this.passcodeService.requestResetPasscode(userId, req.user.userType);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Reset OTP has been sent to your email', common_1.HttpStatus.OK);
    }
    async resetPasscode(input, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        await this.passcodeService.resetPasscode(userId, req.user.userType, req.user.email, input);
        return response_utils_1.ResponseUtil.handleResponse({}, 'Passcode reset successfully', common_1.HttpStatus.OK);
    }
};
exports.PasscodeController = PasscodeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create passcode' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Passcode created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Passcode already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.CreatePasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeController.prototype, "createPasscode", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update passcode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Passcode updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Passcode not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.ChangePasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeController.prototype, "changePasscode", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify passcode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Passcode verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid passcode' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.VerifyPasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeController.prototype, "verifyPasscode", null);
__decorate([
    (0, common_1.Post)('reset-request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request passcode reset OTP' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reset OTP has been sent to your email',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Passcode not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PasscodeController.prototype, "requestResetPasscode", null);
__decorate([
    (0, common_1.Patch)('reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset passcode with OTP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Passcode reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired OTP' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Passcode not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passcode_dto_1.ResetPasscodeDto, Object]),
    __metadata("design:returntype", Promise)
], PasscodeController.prototype, "resetPasscode", null);
exports.PasscodeController = PasscodeController = __decorate([
    (0, swagger_1.ApiTags)('Passcode'),
    (0, common_1.Controller)('auth/passcode'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [passcode_service_1.PasscodeService])
], PasscodeController);
//# sourceMappingURL=passcode.controller.js.map