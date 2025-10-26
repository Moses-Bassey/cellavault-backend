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
let Driver = class Driver extends sequelize_typescript_1.Model {
    fullName;
    phoneNo;
    email;
    userType;
    password;
    loginType;
    isEmailVerified;
    isPhoneVerified;
    isActive;
    isVerified;
    verificationStatus;
    licenseNumber;
    vehicleModel;
    vehicleColor;
    vehiclePlateNumber;
    vehicleYear;
    vehicleType;
    latitude;
    longitude;
    isAvailable;
    rating;
    totalTrips;
    countryId;
    country;
    guarantors;
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
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(15)),
    __metadata("design:type", String)
], Driver.prototype, "phoneNo", void 0);
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
        values: Object.values(user_type_enum_1.UserType),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Driver.prototype, "userType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(1000)),
    __metadata("design:type", String)
], Driver.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM,
        values: Object.values(login_type_enum_1.LoginType),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Driver.prototype, "loginType", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isEmailVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isVerified", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "verificationStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "licenseNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "vehicleModel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "vehicleColor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "vehiclePlateNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "vehicleYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Driver.prototype, "vehicleType", void 0);
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
        type: sequelize_typescript_1.DataType.DECIMAL(3, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Driver.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Driver.prototype, "totalTrips", void 0);
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
    (0, sequelize_typescript_1.BelongsTo)(() => country_entity_1.Country),
    __metadata("design:type", country_entity_1.Country)
], Driver.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => guarantor_entity_1.Guarantor),
    __metadata("design:type", Array)
], Driver.prototype, "guarantors", void 0);
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
        allowNull: false,
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