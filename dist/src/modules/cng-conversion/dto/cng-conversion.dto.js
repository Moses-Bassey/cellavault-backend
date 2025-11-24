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
exports.CreateCngConversionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const transmission_enum_1 = require("../../../enums/transmission.enum");
const fuel_type_enum_1 = require("../../../enums/fuel-type.enum");
const engine_condition_enum_1 = require("../../../enums/engine-condition.enum");
class CreateCngConversionDto {
    fullName;
    email;
    contactPhone;
    nin;
    vehicleRegisterationNo;
    brandOfVehicle;
    color;
    makeOfVehicle;
    yearOfManufacture;
    vinNumber;
    registerationExpiryDate;
    engineCapacity;
    cylinder;
    engineCondition;
    fuelType;
    transmission;
    mileage;
    usualRoute;
    operatingMotorPark;
    conversionCenter;
    residentialState;
    lga;
    address;
    additionalNote;
}
exports.CreateCngConversionDto = CreateCngConversionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'john@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone', example: '+2348100000000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'National Identification Number', example: '12345678901' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(11),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "nin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vehicle registration number', example: 'ABC123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "vehicleRegisterationNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Brand of vehicle', example: 'Toyota' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "brandOfVehicle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Color', example: 'Black' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Make of vehicle', example: 'Camry' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "makeOfVehicle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Year of manufacture', example: '2020' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "yearOfManufacture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'VIN Number', example: '1HGBH41JXMN109186' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "vinNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Registration expiry date', example: '2025-12-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "registerationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Engine capacity', example: '2.0L' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "engineCapacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cylinder', example: '4' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "cylinder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Engine condition', enum: engine_condition_enum_1.ENGINE_CONDITION }),
    (0, class_validator_1.IsEnum)(engine_condition_enum_1.ENGINE_CONDITION),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "engineCondition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fuel type', enum: fuel_type_enum_1.FUEL_TYPE }),
    (0, class_validator_1.IsEnum)(fuel_type_enum_1.FUEL_TYPE),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "fuelType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transmission', enum: transmission_enum_1.TRANSMISSION }),
    (0, class_validator_1.IsEnum)(transmission_enum_1.TRANSMISSION),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "transmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mileage', example: '50000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "mileage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usual route', example: 'Lagos to Abuja' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "usualRoute", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Operating motor park', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "operatingMotorPark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversion center', example: 'ABC Conversion Center' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "conversionCenter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Residential state', example: 'Lagos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "residentialState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Local Government Area', example: 'Ikeja' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "lga", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address', example: '123 Main Street' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCngConversionDto.prototype, "additionalNote", void 0);
//# sourceMappingURL=cng-conversion.dto.js.map