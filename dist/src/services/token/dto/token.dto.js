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
exports.VerifyCustomTokenDto = exports.CreateTokenDto = void 0;
const class_validator_1 = require("class-validator");
const token_enum_1 = require("../../../enums/token.enum");
class CreateTokenDto {
    email;
    phoneNo;
    expiry;
    subject;
}
exports.CreateTokenDto = CreateTokenDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTokenDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTokenDto.prototype, "phoneNo", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTokenDto.prototype, "expiry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTokenDto.prototype, "subject", void 0);
class VerifyCustomTokenDto {
    token;
    email;
    phoneNo;
}
exports.VerifyCustomTokenDto = VerifyCustomTokenDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCustomTokenDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyCustomTokenDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyCustomTokenDto.prototype, "phoneNo", void 0);
//# sourceMappingURL=token.dto.js.map