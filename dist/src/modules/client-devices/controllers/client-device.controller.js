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
exports.ClientDeviceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_device_service_1 = require("../services/client-device.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const response_utils_1 = require("../../../utils/response.utils");
let ClientDeviceController = class ClientDeviceController {
    clientDeviceService;
    constructor(clientDeviceService) {
        this.clientDeviceService = clientDeviceService;
    }
    async findAll() {
        const data = await this.clientDeviceService.findAll();
        return response_utils_1.ResponseUtil.handleResponse(data, 'Client devices retrieved successfully', common_1.HttpStatus.OK);
    }
    async getMyDevices(req) {
        const userId = req.user?.id;
        if (!userId) {
            return { message: 'User not authenticated', statusCode: 401 };
        }
        const data = await this.clientDeviceService.findByUserId(userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User devices retrieved successfully', common_1.HttpStatus.OK);
    }
};
exports.ClientDeviceController = ClientDeviceController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all client devices (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Client devices retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientDeviceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-devices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user devices' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User devices retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientDeviceController.prototype, "getMyDevices", null);
exports.ClientDeviceController = ClientDeviceController = __decorate([
    (0, swagger_1.ApiTags)('Client Devices'),
    (0, common_1.Controller)('client-devices'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [client_device_service_1.ClientDeviceService])
], ClientDeviceController);
//# sourceMappingURL=client-device.controller.js.map