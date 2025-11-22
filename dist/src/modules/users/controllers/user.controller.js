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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../services/user.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const response_utils_1 = require("../../../utils/response.utils");
const validators_utils_1 = require("../../../utils/validators.utils");
const user_dto_1 = require("../dto/user.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async fetchuser(req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.userService.fetchUser(userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User info retrieved successfully', common_1.HttpStatus.OK);
    }
    async dashboard(req, userData) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const ipAddress = req.ip;
        const data = await this.userService.dashboard({
            deviceFCMToken: userData.deviceFCMToken,
            ipAddress: ipAddress || '',
            name: userData.name || '',
        }, userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User dashboard data retrieved successfully', common_1.HttpStatus.OK);
    }
    async updateImageUrl(req, updateImageUrlDto) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.userService.updateImageUrl(userId, updateImageUrlDto.imageUrl);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Image URL updated successfully', common_1.HttpStatus.OK);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user info' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User info retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "fetchuser", null);
__decorate([
    (0, common_1.Post)('dashboard'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.USER),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.DashboardDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Put)('profile-image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update user image URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image URL updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateImageUrlDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateImageUrl", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map