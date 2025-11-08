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
exports.ResetPasscodeDto = exports.VerifyPasscodeDto = exports.ChangePasscodeDto = exports.CreatePasscodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePasscodeDto {
    code;
}
exports.CreatePasscodeDto = CreatePasscodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '6-digit passcode',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], CreatePasscodeDto.prototype, "code", void 0);
class ChangePasscodeDto {
    newPassCode;
    oldPasscode;
}
exports.ChangePasscodeDto = ChangePasscodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '6-digit passcode',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ChangePasscodeDto.prototype, "newPassCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '6-digit passcode',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ChangePasscodeDto.prototype, "oldPasscode", void 0);
class VerifyPasscodeDto {
    code;
}
exports.VerifyPasscodeDto = VerifyPasscodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '6-digit passcode to verify',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], VerifyPasscodeDto.prototype, "code", void 0);
class ResetPasscodeDto {
    otp;
    newCode;
    confirmCode;
}
exports.ResetPasscodeDto = ResetPasscodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '6-digit OTP code',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ResetPasscodeDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New 6-digit passcode',
        example: '654321',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ResetPasscodeDto.prototype, "newCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirm new 6-digit passcode',
        example: '654321',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], ResetPasscodeDto.prototype, "confirmCode", void 0);
//# sourceMappingURL=passcode.dto.js.map