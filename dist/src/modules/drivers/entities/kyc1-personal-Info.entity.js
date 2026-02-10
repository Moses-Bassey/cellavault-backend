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
exports.kyc1PersonalInfo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const gender_enum_1 = require("../../../enums/gender.enum");
const driver_entity_1 = require("./driver.entity");
const country_entity_1 = require("../../countries/entities/country.entity");
let kyc1PersonalInfo = class kyc1PersonalInfo extends sequelize_typescript_1.Model {
    driverId;
    driver;
    countryId;
    country;
    fullName;
    phoneNo;
    email;
    gender;
    dateOfBirth;
    phoneBrand;
    phoneModel;
    isVerified;
    schoolCertificateImageUrl;
    utilityBillImageUrl;
};
exports.kyc1PersonalInfo = kyc1PersonalInfo;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => driver_entity_1.Driver),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "driverId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => driver_entity_1.Driver),
    __metadata("design:type", driver_entity_1.Driver)
], kyc1PersonalInfo.prototype, "driver", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => country_entity_1.Country),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "countryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => country_entity_1.Country),
    __metadata("design:type", country_entity_1.Country)
], kyc1PersonalInfo.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "fullName", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(15),
        allowNull: false,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "phoneNo", void 0);
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
], kyc1PersonalInfo.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(gender_enum_1.GENDER),
        allowNull: false,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], kyc1PersonalInfo.prototype, "dateOfBirth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "phoneBrand", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "phoneModel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], kyc1PersonalInfo.prototype, "isVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "schoolCertificateImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], kyc1PersonalInfo.prototype, "utilityBillImageUrl", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], kyc1PersonalInfo.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], kyc1PersonalInfo.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], kyc1PersonalInfo.prototype, "deletedAt", void 0);
exports.kyc1PersonalInfo = kyc1PersonalInfo = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'driver_kyc_1_personal_information',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['deletedAt'],
            },
        },
    })
], kyc1PersonalInfo);
//# sourceMappingURL=kyc1-personal-Info.entity.js.map