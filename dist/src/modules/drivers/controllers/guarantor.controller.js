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
let GuarantorController = class GuarantorController {
    guarantorService;
    constructor(guarantorService) {
        this.guarantorService = guarantorService;
    }
    async create(driverId, guarantorData) {
        return await this.guarantorService.create(driverId, guarantorData);
    }
    async findByDriverId(driverId) {
        return await this.guarantorService.findByDriverId(driverId);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuarantorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_type_enum_1.UserType.DRIVER, user_type_enum_1.UserType.PEPP_ADMIN, user_type_enum_1.UserType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all guarantors for a driver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guarantors retrieved successfully' }),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuarantorController.prototype, "findByDriverId", null);
exports.GuarantorController = GuarantorController = __decorate([
    (0, swagger_1.ApiTags)('Guarantors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('drivers/guarantors'),
    __metadata("design:paramtypes", [guarantor_service_1.GuarantorService])
], GuarantorController);
//# sourceMappingURL=guarantor.controller.js.map