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
exports.Driver = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_type_enum_1 = require("../../../enums/user-type.enum");
const country_entity_1 = require("../../countries/entities/country.entity");
const login_type_enum_1 = require("../../../enums/login-type.enum");
const guarantor_entity_1 = require("./guarantor.entity");
const kyc1_personal_Info_entity_1 = require("./kyc1-personal-Info.entity");
const kyc2_Id_Information_entity_1 = require("./kyc2-Id-Information.entity");
const kyc3_residential_Information_entity_1 = require("./kyc3-residential-Information.entity");
const gender_enum_1 = require("../../../enums/gender.enum");
const driver_verification_status_enum_1 = require("../../../enums/driver-verification-status.enum");
const drivers_shift_enums_1 = require("../../../enums/drivers-shift.enums");
const kyc_enums_1 = require("../../../enums/kyc.enums");
let Driver = class Driver extends sequelize_typescript_1.Model {
    fullName;
    phoneNo;
    kycCompleted;
    isGuarantorCompleted;
    email;
    gender;
    userType;
    password;
    profileImageUrl;
    driverShift;
    loginType;
    isEmailVerified;
    isPhoneVerified;
    isActive;
    isDisabled;
    hasPasscode;
    verificationStatus;
    latitude;
    longitude;
    isAvailable;
    isPeppcruiseDriver;
    countryId;
    accountNo;
    bankName;
    bankCode;
    accountName;
    bvn;
    country;
    guarantors;
    driverPersonalInfoKyc;
    driverIdKyc;
    driverAddressKyc;
    licenseImageUrl;
};
exports.Driver = Driver;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Driver.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(150)),
    __metadata("design:type", String)
], Driver.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(300),
        unique: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Driver.prototype, "phoneNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(kyc_enums_1.KYC_COMPLETED),
        allowNull: false,
        defaultValue: kyc_enums_1.KYC_COMPLETED.NOT_COMPLETED,
    }),
    __metadata("design:type", String)
], Driver.prototype, "kycCompleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isGuarantorCompleted", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    }),
    __metadata("design:type", String)
], Driver.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(gender_enum_1.GENDER),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Driver.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(user_type_enum_1.UserType),
        allowNull: false,
        defaultValue: user_type_enum_1.UserType.DRIVER,
    }),
    __metadata("design:type", String)
], Driver.prototype, "userType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2000)),
    __metadata("design:type", String)
], Driver.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "profileImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(drivers_shift_enums_1.DRIVER_SHIFT),
        allowNull: false,
        defaultValue: drivers_shift_enums_1.DRIVER_SHIFT.NO_SHIFT,
    }),
    __metadata("design:type", String)
], Driver.prototype, "driverShift", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(login_type_enum_1.LoginType),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Driver.prototype, "loginType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isEmailVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isDisabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "hasPasscode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        allowNull: false,
        values: Object.values(driver_verification_status_enum_1.DRIVER_VERIFICATION_STATUS),
        defaultValue: driver_verification_status_enum_1.DRIVER_VERIFICATION_STATUS.PENDING,
    }),
    __metadata("design:type", String)
], Driver.prototype, "verificationStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 8),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Driver.prototype, "latitude", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(11, 8),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Driver.prototype, "longitude", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isAvailable", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isPeppcruiseDriver", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => country_entity_1.Country),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "countryId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "accountNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "bankName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "bankCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "accountName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(11),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Driver.prototype, "bvn", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => country_entity_1.Country),
    __metadata("design:type", country_entity_1.Country)
], Driver.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => guarantor_entity_1.Guarantor),
    __metadata("design:type", Array)
], Driver.prototype, "guarantors", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => kyc1_personal_Info_entity_1.kyc1PersonalInfo),
    __metadata("design:type", kyc1_personal_Info_entity_1.kyc1PersonalInfo)
], Driver.prototype, "driverPersonalInfoKyc", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => kyc2_Id_Information_entity_1.kyc2IdInformation),
    __metadata("design:type", kyc2_Id_Information_entity_1.kyc2IdInformation)
], Driver.prototype, "driverIdKyc", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => kyc3_residential_Information_entity_1.kyc3ResidentialInformation),
    __metadata("design:type", kyc3_residential_Information_entity_1.kyc3ResidentialInformation)
], Driver.prototype, "driverAddressKyc", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(1000),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "licenseImageUrl", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Driver.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Driver.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Driver.prototype, "deletedAt", void 0);
exports.Driver = Driver = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'drivers',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['deletedAt'],
            },
        },
    })
], Driver);
//# sourceMappingURL=driver.entity.js.map