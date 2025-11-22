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
exports.GuarantorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guarantor_service_1 = require("../services/guarantor.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const validators_utils_1 = require("../../../utils/validators.utils");
const guarantor_dto_1 = require("../dto/guarantor.dto");
const response_utils_1 = require("../../../utils/response.utils");
let GuarantorController = class GuarantorController {
    guarantorService;
    constructor(guarantorService) {
        this.guarantorService = guarantorService;
    }
    async create(driverId, guarantorData, req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.guarantorService.create(userId, guarantorData);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Guarantor added successfully', common_1.HttpStatus.CREATED);
    }
    async findByDriverId(req) {
        const userId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const data = await this.guarantorService.findByDriverId(userId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Guarantors retrieved successfully', common_1.HttpStatus.OK);
    }
    async deleteGuarantor(req, id) {
        const driverId = validators_utils_1.Validators.validateUuid(req.user.userId);
        const guarantorId = validators_utils_1.Validators.validateUuid(id);
        const data = await this.guarantorService.deleteGuarantor(guarantorId, driverId);
        return response_utils_1.ResponseUtil.handleResponse(data, 'Guarantor deleted successfully', common_1.HttpStatus.OK);
    }
};
exports.GuarantorController = GuarantorController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Add a guarantor to a driver' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Guarantor added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Maximum guarantors reached (max 3)' }),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guarantor_dto_1.CreateGuarantorDto, Object]),
    __metadata("design:returntype", Promise)
], GuarantorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all guarantors for a driver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guarantors retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuarantorController.prototype, "findByDriverId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all guarantors for a driver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guarantors retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GuarantorController.prototype, "deleteGuarantor", null);
exports.GuarantorController = GuarantorController = __decorate([
    (0, swagger_1.ApiTags)('Guarantors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('drivers/guarantors'),
    __metadata("design:paramtypes", [guarantor_service_1.GuarantorService])
], GuarantorController);
//# sourceMappingURL=guarantor.controller.js.map