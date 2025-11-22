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
exports.CreateVehicleRegistrationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateVehicleRegistrationDto {
    vehicleRegisterationNo;
    brandOfVehicle;
    color;
    makeOfVehicle;
    vinNumber;
    registerationExpiryDate;
    plateNumberUrl;
    plateNo;
}
exports.CreateVehicleRegistrationDto = CreateVehicleRegistrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vehicle registration number',
        example: 'ABC123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "vehicleRegisterationNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brand of vehicle',
        example: 'Toyota',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "brandOfVehicle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color of vehicle',
        example: 'Black',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Make of vehicle',
        example: 'Camry',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "makeOfVehicle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'VIN Number',
        example: '1HGBH41JXMN109186',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "vinNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Registration expiry date',
        example: '2025-12-31',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "registerationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plate number image URL',
        example: 'https://example.com/plate.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "plateNumberUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plate number',
        example: 'ABC-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateVehicleRegistrationDto.prototype, "plateNo", void 0);
//# sourceMappingURL=vehicle-registration.dto.js.map