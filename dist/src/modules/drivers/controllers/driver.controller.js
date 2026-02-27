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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const driver_service_1 = require("../services/driver.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const response_utils_1 = require("../../../utils/response.utils");
const uuid_validator_pipe_1 = require("../../../shared/pipes/uuid.validator.pipe");
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    async getSummary() {
        const data = await this.driverService.getSummary();
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
    async listDrivers(search, status, kycStatus, limit, cursor) {
        const data = await this.driverService.listDrivers({
            search,
            status,
            kycStatus,
            limit: limit ? Number(limit) : undefined,
            cursor,
        });
        console.log('data: ', data);
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
    async getDriver(driverId) {
        const data = await this.driverService.getDriverAccount(driverId);
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
    async updateDriver(driverId, body) {
        const data = await this.driverService.updateDriverAccount(driverId, body);
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
    async suspend(driverId, body) {
        const data = await this.driverService.suspendDriver(driverId, body);
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
    async unsuspend(driverId) {
        const data = await this.driverService.unsuspendDriver(driverId);
        return response_utils_1.ResponseUtil.handleResponse(data, '', common_1.HttpStatus.OK);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('kycStatus')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "listDrivers", null);
__decorate([
    (0, common_1.Get)(':driverId'),
    __param(0, (0, common_1.Param)('driverId', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getDriver", null);
__decorate([
    (0, common_1.Patch)(':driverId'),
    __param(0, (0, common_1.Param)('driverId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateDriver", null);
__decorate([
    (0, common_1.Post)(':driverId/suspend'),
    __param(0, (0, common_1.Param)('driverId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "suspend", null);
__decorate([
    (0, common_1.Post)(':driverId/unsuspend'),
    __param(0, (0, common_1.Param)('driverId', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "unsuspend", null);
exports.DriverController = DriverController = __decorate([
    (0, swagger_1.ApiTags)('Drivers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('admin/drivers'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map