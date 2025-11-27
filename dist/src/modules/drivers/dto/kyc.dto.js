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
exports.UpdateBankAccountDto = exports.ValidateBankAccountDto = exports.CreateKyc3Dto = exports.CreateKyc2Dto = exports.CreateKyc1Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../../enums/gender.enum");
const identification_enums_1 = require("../../../enums/identification.enums");
const proof_of_address_type_enum_1 = require("../../../enums/proof-of-address-type.enum");
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
    streetAddress;
    landmark;
    postalOrZipCode;
    proofOfAddressType;
    proofOfAddressImage;
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
        description: 'Street address',
        example: '123 Main Street',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "streetAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Landmark',
        example: 'Near the shopping mall',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal or Zip code',
        example: '100001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "postalOrZipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proof of address type',
        example: proof_of_address_type_enum_1.PROOF_OF_ADDRESS_TYPE.UTILITY_BILL,
        enum: proof_of_address_type_enum_1.PROOF_OF_ADDRESS_TYPE,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(proof_of_address_type_enum_1.PROOF_OF_ADDRESS_TYPE),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "proofOfAddressType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proof of address image URL',
        example: 'https://example.com/proof-of-address.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateKyc3Dto.prototype, "proofOfAddressImage", void 0);
class ValidateBankAccountDto {
    bankCode;
    accountNo;
}
exports.ValidateBankAccountDto = ValidateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank code',
        example: '044',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ValidateBankAccountDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account number',
        example: '0123456789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], ValidateBankAccountDto.prototype, "accountNo", void 0);
class UpdateBankAccountDto {
    bankCode;
    accountNo;
    accountName;
    bankName;
}
exports.UpdateBankAccountDto = UpdateBankAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank code',
        example: '044',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account number',
        example: '0123456789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "accountNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "accountName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bank Name',
        example: 'Access Bank',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateBankAccountDto.prototype, "bankName", void 0);
//# sourceMappingURL=kyc.dto.js.map