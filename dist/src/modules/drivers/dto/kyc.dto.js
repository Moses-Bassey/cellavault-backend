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
exports.CreateKyc3Dto = exports.CreateKyc2Dto = exports.CreateKyc1Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../../enums/gender.enum");
const identification_enums_1 = require("../../../enums/identification.enums");
class CreateKyc1Dto {
    fullName;
    phoneNo;
    countryId;
    email;
    gender;
    dateOfBirth;
    phoneBrand;
    phoneModel;
    schoolCertificateImageUrl;
    utilityBillImageUrl;
}
exports.CreateKyc1Dto = CreateKyc1Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Driver full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+2348100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "countryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'driver@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(320),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gender',
        example: gender_enum_1.GENDER.MALE,
        enum: gender_enum_1.GENDER,
    }),
    (0, class_validator_1.IsEnum)(gender_enum_1.GENDER),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth',
        example: '1990-01-01',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone brand',
        example: 'Samsung',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "phoneBrand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone model',
        example: 'Galaxy S21',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "phoneModel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School certificate image URL',
        example: 'https://example.com/certificate.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "schoolCertificateImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utility bill image URL',
        example: 'https://example.com/bill.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateKyc1Dto.prototype, "utilityBillImageUrl", void 0);
class CreateKyc2Dto {
    identificationType;
    identificationNumber;
    identificationImageUrl;
}
exports.CreateKyc2Dto = CreateKyc2Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identification type',
        example: identification_enums_1.IDENTIFICATION_TYPE.NATIONAL_ID,
        enum: identification_enums_1.IDENTIFICATION_TYPE,
    }),
    (0, class_validator_1.IsEnum)(identification_enums_1.IDENTIFICATION_TYPE),
    __metadata("design:type", String)
], CreateKyc2Dto.prototype, "identificationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identification number',
        example: '1234567890',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateKyc2Dto.prototype, "identificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identification image URL',
        example: 'https://example.com/id.jpg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateKyc2Dto.prototype, "identificationImageUrl", void 0);
class CreateKyc3Dto {
    stateId;
    city;
    verified;
}
exports.CreateKyc3Dto = CreateKyc3Dto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "stateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City name',
        example: 'Lagos',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification status',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateKyc3Dto.prototype, "verified", void 0);
//# sourceMappingURL=kyc.dto.js.map