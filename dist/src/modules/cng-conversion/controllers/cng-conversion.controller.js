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
exports.CngConversionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cng_conversion_service_1 = require("../services/cng-conversion.service");
const cng_station_service_1 = require("../services/cng-station.service");
const cng_conversion_dto_1 = require("../dto/cng-conversion.dto");
const response_utils_1 = require("../../../utils/response.utils");
const validators_utils_1 = require("../../../utils/validators.utils");
const enums_1 = require("../../../enums");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let CngConversionController = class CngConversionController {
    cngConversionService;
    cngStationService;
    constructor(cngConversionService, cngStationService) {
        this.cngConversionService = cngConversionService;
        this.cngStationService = cngStationService;
    }
    async create(cngConversionData, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.cngConversionService.create(userId, req.user.userType, cngConversionData);
        return response_utils_1.ResponseUtil.handleResponse(data, 'CNG conversion request created successfully', common_1.HttpStatus.CREATED);
    }
    async getTransmissions() {
        const data = await this.cngConversionService.fetchTransmission();
        return response_utils_1.ResponseUtil.handleResponse(data, 'Transmission types retrieved successfully', common_1.HttpStatus.OK);
    }
    async getStations() {
        const stations = await this.cngStationService.findAll();
        return response_utils_1.ResponseUtil.handleResponse(stations, 'CNG stations retrieved successfully', common_1.HttpStatus.OK);
    }
    async fetchUserCngConversions(req, page = 1, limit = 10) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.cngConversionService.fetchUserCngConversions(userId, page, limit);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Fetch cng conversions retrieved successfully', common_1.HttpStatus.OK);
    }
    async fetchUserCngConversionsStats(req, page = 1, limit = 10) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.cngConversionService.fetchUserCngConversionsStats(userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Fetch cng conversions retrieved successfully', common_1.HttpStatus.OK);
    }
};
exports.CngConversionController = CngConversionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a CNG conversion request' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'CNG conversion request created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cng_conversion_dto_1.CreateCngConversionDto, Object]),
    __metadata("design:returntype", Promise)
], CngConversionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('vehicle-transmissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of transmission types' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transmission types retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CngConversionController.prototype, "getTransmissions", null);
__decorate([
    (0, common_1.Get)('stations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of CNG stations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CNG stations retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CngConversionController.prototype, "getStations", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of CNG stations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CNG stations retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CngConversionController.prototype, "fetchUserCngConversions", null);
__decorate([
    (0, common_1.Get)('/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of CNG stations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CNG stations retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CngConversionController.prototype, "fetchUserCngConversionsStats", null);
exports.CngConversionController = CngConversionController = __decorate([
    (0, swagger_1.ApiTags)('CNG Conversion'),
    (0, common_1.Controller)('cng-conversion'),
    (0, roles_decorator_1.Roles)(enums_1.UserType.PEPP_ADMIN, enums_1.UserType.SUPER_ADMIN, enums_1.UserType.USER, enums_1.UserType.DRIVER),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cng_conversion_service_1.CngConversionService,
        cng_station_service_1.CngStationService])
], CngConversionController);
//# sourceMappingURL=cng-conversion.controller.js.map