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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetUsersQueryDto {
    search;
    status;
    limit = 10;
    page = 1;
}
exports.GetUsersQueryDto = GetUsersQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search parameter', example: 'john' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUsersQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by active status', example: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined)
            return undefined;
        if (typeof value === 'boolean')
            return value;
        const normalized = value.toString().toLowerCase();
        console.log('Type value: ', normalized);
        if (['true', '1'].includes(normalized))
            return true;
        if (['false', '0'].includes(normalized))
            return false;
        throw new common_1.UnprocessableEntityException(`Invalid status value: "${value}". Allowed values are true, false, 1, 0.`);
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetUsersQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page', example: 10 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GetUsersQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page number', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GetUsersQueryDto.prototype, "page", void 0);
//# sourceMappingURL=user.dto.js.map