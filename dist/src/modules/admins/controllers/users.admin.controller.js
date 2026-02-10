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
exports.UserAdminController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const user_admin_service_1 = require("../services/user.admin.service");
const response_utils_1 = require("../../../utils/response.utils");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const validators_utils_1 = require("../../../utils/validators.utils");
const uuid_validator_pipe_1 = require("../../../shared/pipes/uuid.validator.pipe");
const user_dto_1 = require("../dto/user.dto");
let UserAdminController = class UserAdminController {
    userAdminService;
    constructor(userAdminService) {
        this.userAdminService = userAdminService;
    }
    async getUsersData() {
        const data = await this.userAdminService.getUsersData();
        return response_utils_1.ResponseUtil.handleResponse(data, 'Users data retrieved successfully', common_1.HttpStatus.OK);
    }
    async getAllUsers(query) {
        const data = await this.userAdminService.findAll({
            search: query.search,
            status: query.status,
            limit: query.limit,
            page: query.page,
        });
        return response_utils_1.ResponseUtil.handleResponse(data, 'Users retrieved successfully', common_1.HttpStatus.OK);
    }
    async getUserById(id) {
        const data = await this.userAdminService.findById(id);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User retrieved successfully', common_1.HttpStatus.OK);
    }
    async suspendUser(id, password, req) {
        const adminId = validators_utils_1.Validators.validateUuidV4(req.user.userId);
        await this.userAdminService.disableUser(id, adminId, password);
        return response_utils_1.ResponseUtil.handleResponse({}, 'User disabled', common_1.HttpStatus.OK);
    }
};
exports.UserAdminController = UserAdminController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users metrics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Users metrics not found' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getUsersData", null);
__decorate([
    (0, common_1.Get)('find'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.GetUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    __param(0, (0, common_1.Param)('id', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)(':id/suspend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    __param(0, (0, common_1.Param)('id', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "suspendUser", null);
exports.UserAdminController = UserAdminController = __decorate([
    (0, swagger_1.ApiTags)('Users (Admin)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    (0, common_1.Controller)('admin/users'),
    __metadata("design:paramtypes", [user_admin_service_1.UserAdminService])
], UserAdminController);
//# sourceMappingURL=users.admin.controller.js.map