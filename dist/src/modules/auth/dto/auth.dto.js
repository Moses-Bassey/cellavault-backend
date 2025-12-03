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
exports.SignUserDto = exports.VerifyOtpDto = exports.SignupPhone = exports.SignupEmail = exports.ResendOtpDto = exports.ChangePasswordDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.LoginOtpDto = exports.LoginUserSocialDto = exports.LoginUserDto = exports.SignUpSocialUserDto = exports.SignUpUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const login_type_enum_1 = require("../../../enums/login-type.enum");
const token_enum_1 = require("../../../enums/token.enum");
class SignUpUserDto {
    email;
    password;
    phoneNo;
    otpPhone;
    otpEmail;
    country;
    fullName;
    referalCode;
}
exports.SignUpUserDto = SignUpUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(320),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Phone No',
        example: '+234 8100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "phoneNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "otpPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "otpEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'Country',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.Matches)(/^[A-Za-z _'-]+$/, {
        message: 'Only letters, spaces, underscores, apostrophes, and hyphens are allowed in fullName field'
    }),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referal code',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], SignUpUserDto.prototype, "referalCode", void 0);
class SignUpSocialUserDto {
    loginType;
    email;
    password;
    phoneNo;
    otpPhone;
    otpEmail;
    country;
    fullName;
    referalCode;
}
exports.SignUpSocialUserDto = SignUpSocialUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Login type',
        example: 'NORMAL',
    }),
    (0, class_validator_1.IsEnum)(login_type_enum_1.LoginType),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "loginType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(320),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Phone No',
        example: '+234 8100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "phoneNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "otpPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "otpEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'Country',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.Matches)(/^[A-Za-z _'-]+$/, {
        message: 'Only letters, spaces, underscores, apostrophes, and hyphens are allowed in fullName field'
    }),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referal code',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], SignUpSocialUserDto.prototype, "referalCode", void 0);
class LoginUserDto {
    identity;
    password;
    country;
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address or phone number',
        example: 'user@example.com or 08100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LoginUserDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "country", void 0);
class LoginUserSocialDto {
    identity;
    loginType;
}
exports.LoginUserSocialDto = LoginUserSocialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address or phone number',
        example: 'user@example.com or 08100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LoginUserSocialDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Login type',
        example: 'NORMAL',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginUserSocialDto.prototype, "loginType", void 0);
class LoginOtpDto {
    identity;
    otp;
    deviceInfo;
    country;
}
exports.LoginOtpDto = LoginOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address or phone number',
        example: 'user@example.com or 08100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "identity", void 0);
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
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LoginOtpDto.prototype, "country", void 0);
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to send password otp',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    token;
    password;
    confirmPassword;
    email;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token to reset password',
        example: 'token123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password',
        example: 'newPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirm new password',
        example: 'newPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to reset password',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
class ChangePasswordDto {
    oldPassword;
    newPassword;
    confirmPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current password',
        example: 'oldPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password',
        example: 'newPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirm new password',
        example: 'newPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);
class ResendOtpDto {
    email;
}
exports.ResendOtpDto = ResendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to resend OTP',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "email", void 0);
class SignupEmail {
    email;
}
exports.SignupEmail = SignupEmail;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignupEmail.prototype, "email", void 0);
class SignupPhone {
    phoneNo;
    country;
}
exports.SignupPhone = SignupPhone;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'PhoneNo sign up phone',
        example: '08100000000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupPhone.prototype, "phoneNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupPhone.prototype, "country", void 0);
class VerifyOtpDto {
    token;
    email;
    phoneNo;
    country;
    subject;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token to verify OTP',
        example: 'token123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email to verify OTP',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'PhoneNo to verify OTP',
        example: '08100000000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "phoneNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "subject", void 0);
class SignUserDto {
    fullName;
    email;
    phoneNo;
    country;
    password;
}
exports.SignUserDto = SignUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z _'-]+$/, {
        message: 'Only letters, spaces, underscores, apostrophes, and hyphens are allowed in fullName field'
    }),
    __metadata("design:type", String)
], SignUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Phone',
        example: '8100000000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUserDto.prototype, "phoneNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country ',
        example: 'Country',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUserDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map