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
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const response_utils_1 = require("../../../utils/response.utils");
const uuid_validator_pipe_1 = require("../../../shared/pipes/uuid.validator.pipe");
const trip_entity_1 = require("../../trips/entities/trip.entity");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getPassenger(passengerId) {
        const data = await this.userService.getPassengerAccount(passengerId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User details retrieved', common_1.HttpStatus.OK);
    }
    async updatePassenger(passengerId, body) {
        const data = await this.userService.updatePassengerAccount(passengerId, body);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User details updated', common_1.HttpStatus.OK);
    }
    async suspendPassenger(passengerId, body) {
        const data = await this.userService.suspendPassenger(passengerId, body);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User account suspended', common_1.HttpStatus.OK);
    }
    async unsuspendPassenger(passengerId) {
        const data = await this.userService.unsuspendPassenger(passengerId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'User account enabled', common_1.HttpStatus.OK);
    }
    async getActivitySummary(passengerId, from, to) {
        const data = await this.userService.getPassengerActivitySummary({
            passengerId,
            from,
            to,
        });
        return response_utils_1.ResponseUtil.handleResponse(data, "User's ride activity retrieved successfully", common_1.HttpStatus.OK);
    }
    async listRides(passengerId, from, to, status, limit, cursor) {
        const data = await this.userService.listPassengerRides({
            passengerId,
            from,
            to,
            status,
            limit: limit ? Number(limit) : undefined,
            cursor,
        });
        return response_utils_1.ResponseUtil.handleResponse(data, "User's ride history retrieved successfully", common_1.HttpStatus.OK);
    }
    async getRideDetails(passengerId, rideId) {
        const data = await this.userService.getRideDetails(passengerId, rideId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Ride details retrieved successfully', common_1.HttpStatus.OK);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get User account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User fetchced successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPassenger", null);
__decorate([
    (0, common_1.Patch)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User details updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassenger", null);
__decorate([
    (0, common_1.Post)(':userId/suspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User account suspended' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Failed to suspend user account' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "suspendPassenger", null);
__decorate([
    (0, common_1.Post)(':userId/unsuspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User account enabled' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Failed to enable user account' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unsuspendPassenger", null);
__decorate([
    (0, common_1.Get)(':userId/activity/summary'),
    (0, swagger_1.ApiOperation)({ summary: "Fetch user's ride activity" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User's ride activity retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Failed to retrieve user's ride activity",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User's ride activity not found" }),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getActivitySummary", null);
__decorate([
    (0, common_1.Get)(':userId/activity/rides'),
    (0, swagger_1.ApiOperation)({ summary: "Fetch user's ride history" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User's ride history retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Failed to retrieve user's ride history",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User's ride history not found" }),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listRides", null);
__decorate([
    (0, common_1.Get)(':userId/activity/rides/:rideId'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch ride details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ride details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Failed to retrieve ride's details",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ride details not found' }),
    __param(0, (0, common_1.Param)('userId', uuid_validator_pipe_1.UuidValidationPipe)),
    __param(1, (0, common_1.Param)('rideId', uuid_validator_pipe_1.UuidValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRideDetails", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN, user_type_enum_1.UserType.PEPP_MANAGER),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map