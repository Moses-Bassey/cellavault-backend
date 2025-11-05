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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const country_service_1 = require("../services/country.service");
const state_service_1 = require("../services/state.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
let CountryController = class CountryController {
    countryService;
    stateService;
    constructor(countryService, stateService) {
        this.countryService = countryService;
        this.stateService = stateService;
    }
    async findAll() {
        const data = await this.countryService.findAll();
        return data;
    }
    async getStatesByCountry(countryId) {
        return await this.stateService.findByCountryId(countryId);
    }
    async findById(id) {
        return await this.countryService.findById(id);
    }
    async create(countryData) {
        return await this.countryService.create(countryData);
    }
    async update(id, countryData) {
        return await this.countryService.update(id, countryData);
    }
    async delete(id) {
        return await this.countryService.delete(id);
    }
};
exports.CountryController = CountryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all countries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Countries retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/states'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all states for a country' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'States retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Country not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "getStatesByCountry", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get country by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Country retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Country not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new country' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Country created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update country' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Country updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Country not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete country' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Country deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Country not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "delete", null);
exports.CountryController = CountryController = __decorate([
    (0, swagger_1.ApiTags)('Countries'),
    (0, common_1.Controller)('countries'),
    __metadata("design:paramtypes", [country_service_1.CountryService,
        state_service_1.StateService])
], CountryController);
//# sourceMappingURL=country.controller.js.map