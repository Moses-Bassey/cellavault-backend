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
exports.CreateGuarantorsDto = exports.CreateGuarantorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateGuarantorDto {
    fullName;
    phoneNo;
    email;
    identificationImageUrl;
    utilityBillImageUrl;
    policeClearanceImageUrl;
    reference;
    country;
}
exports.CreateGuarantorDto = CreateGuarantorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Guarantor full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.Matches)(/^[A-Za-z _'-]+$/, {
        message: 'Only letters, spaces, underscores, apostrophes, and hyphens are allowed in fullName field'
    }),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+2348100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'guarantor@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(320),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identification image URL',
        example: 'https://example.com/id.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "identificationImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utility bill image URL',
        example: 'https://example.com/bill.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "utilityBillImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Police clearance image URL',
        example: 'https://example.com/clearance.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "policeClearanceImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reference information',
        example: 'Reference from employer or previous contact',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'Nigeria',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateGuarantorDto.prototype, "country", void 0);
class CreateGuarantorsDto {
    guarantors;
}
exports.CreateGuarantorsDto = CreateGuarantorsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of guarantors to create',
        type: [CreateGuarantorDto],
        example: [
            {
                fullName: 'John Doe',
                phoneNo: '+2348100000000',
                email: 'john@example.com',
                identificationImageUrl: 'https://example.com/id.jpg',
                utilityBillImageUrl: 'https://example.com/bill.jpg',
                policeClearanceImageUrl: 'https://example.com/clearance.jpg',
            },
            {
                fullName: 'Jane Smith',
                phoneNo: '+2348100000001',
                email: 'jane@example.com',
                identificationImageUrl: 'https://example.com/id2.jpg',
                utilityBillImageUrl: 'https://example.com/bill2.jpg',
                policeClearanceImageUrl: 'https://example.com/clearance2.jpg',
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(2),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateGuarantorDto),
    __metadata("design:type", Array)
], CreateGuarantorsDto.prototype, "guarantors", void 0);
//# sourceMappingURL=guarantor.dto.js.map