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
const validators_utils_1 = require("../../../utils/validators.utils");
const user_dto_1 = require("../../users/dto/user.dto");
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    async fetchDriver(req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.driverService.fetchDriver(userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Driver retrieved successfully', common_1.HttpStatus.OK);
    }
    async dashboard(reqBody, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        console.log(userId);
        const ipAddress = req.ip;
        const data = await this.driverService.dashboard({
            ipAddress: ipAddress || '',
            name: reqBody.name || '',
            deviceFCMToken: reqBody.deviceFCMToken,
        }, userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Driver dashboard data retrieved successfully', common_1.HttpStatus.OK);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get a driver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Driver not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "fetchDriver", null);
__decorate([
    (0, common_1.Post)('dashboard'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Driver dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver dashboard data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DashboardDto, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "dashboard", null);
exports.DriverController = DriverController = __decorate([
    (0, swagger_1.ApiTags)('Drivers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map