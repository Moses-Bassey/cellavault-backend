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
exports.LoginOtpDto = exports.AdminLoginDto = exports.UpdateAdminDto = exports.CreateAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_type_enum_1 = require("../../../enums/user-type.enum");
class CreateAdminDto {
    fullName;
    email;
    password;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Admin's fullname",
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's Email", example: 'example@gmail.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's password", example: '32rvn39nved' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
class UpdateAdminDto {
    fullName;
    email;
    password;
    role;
    isVerified;
    isActive;
}
exports.UpdateAdminDto = UpdateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Admin's fullname",
        example: 'John Doe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's Email", example: 'example@gmail.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's password", example: '32rvn39nved' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Admin's role",
        example: 'John Doe',
    }),
    (0, class_validator_1.IsEnum)(user_type_enum_1.AdminType),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Admin account's verification status",
        example: 'example@gmail.com',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAdminDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Admin account's active status",
        example: '32rvn39nved',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateAdminDto.prototype, "isActive", void 0);
class AdminLoginDto {
    email;
    password;
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's Email", example: 'example@gmail.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Admin's password", example: '32rvn39nved' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
class LoginOtpDto {
    email;
    password;
    otp;
    deviceInfo;
    country;
}
exports.LoginOtpDto = LoginOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device information',
        example: 'Web Browser',
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], LoginOtpDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'Country',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "country", void 0);
//# sourceMappingURL=admin.dto.js.map