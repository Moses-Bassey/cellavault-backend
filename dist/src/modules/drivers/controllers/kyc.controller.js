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
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kyc_service_1 = require("../services/kyc.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const kyc_dto_1 = require("../dto/kyc.dto");
const response_utils_1 = require("../../../utils/response.utils");
let KycController = class KycController {
    kycService;
    constructor(kycService) {
        this.kycService = kycService;
    }
    async getAllKycByDriver(req) {
        const data = await this.kycService.getAllKycByDriverId(req.user.userId);
        return response_utils_1.ResponseUtil.success(data, 'All KYC retrieved successfully', common_1.HttpStatus.OK);
    }
    async createKyc1(kycData, req) {
        const data = await this.kycService.createKyc1(req.user.userId, kycData);
        return response_utils_1.ResponseUtil.handleResponse(data, 'KYC1 personal information created successfully', common_1.HttpStatus.CREATED);
    }
    async getKyc1PersonalInfo(req) {
        const data = await this.kycService.fetchKyc1ByDriverId(req.user.userId);
        return response_utils_1.ResponseUtil.success(data, 'KYC1 personal information retrieved successfully', common_1.HttpStatus.OK);
    }
    async createKyc2IdInformation(kycData, req) {
        const data = await this.kycService.createKyc2(req.user.userId, kycData);
        return response_utils_1.ResponseUtil.handleResponse(data, 'KYC2 information created successfully', common_1.HttpStatus.CREATED);
    }
    async getKyc2IdInformation(req) {
        const data = await this.kycService.fetchKyc2ByDriverId(req.user.userId);
        return response_utils_1.ResponseUtil.success(data, 'KYC2 information retrieved successfully', common_1.HttpStatus.OK);
    }
    async createKyc3AddressInformation(kycData, req) {
        const data = await this.kycService.createKyc3(req.user.userId, kycData);
        return response_utils_1.ResponseUtil.handleResponse(data, 'KYC3 residential information created successfully', common_1.HttpStatus.CREATED);
    }
    async getKyc3AddressInformation(req) {
        const data = await this.kycService.fetchKyc3ByDriverId(req.user.userId);
        return response_utils_1.ResponseUtil.success(data, 'KYC3 residential information retrieved successfully', common_1.HttpStatus.OK);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER, user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KYC by driver' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All KYC retrieved successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getAllKycByDriver", null);
__decorate([
    (0, common_1.Post)('personal-info'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KYC1 personal information' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'KYC1 personal information created/updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kyc_dto_1.CreateKyc1Dto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "createKyc1", null);
__decorate([
    (0, common_1.Get)('personal-info'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER, user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC1 personal information by driver ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'KYC1 personal information retrieved successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKyc1PersonalInfo", null);
__decorate([
    (0, common_1.Post)('id-information'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KYC2 id information' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'KYC2 id information created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kyc_dto_1.CreateKyc2Dto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "createKyc2IdInformation", null);
__decorate([
    (0, common_1.Get)('id-information'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER, user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC2 id information by driver' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'KYC2 id information retrieved successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKyc2IdInformation", null);
__decorate([
    (0, common_1.Post)('Residential-information'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KYC1 residential information' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'KYC2 information created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kyc_dto_1.CreateKyc3Dto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "createKyc3AddressInformation", null);
__decorate([
    (0, common_1.Get)('residential-information'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC3 residential information by driver' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'KYC3 residential information retrieved successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKyc3AddressInformation", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('KYC'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('drivers/kyc'),
    __metadata("design:paramtypes", [kyc_service_1.KycService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map