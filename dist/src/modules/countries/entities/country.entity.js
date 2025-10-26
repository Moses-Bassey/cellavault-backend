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
exports.Country = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Country = class Country extends sequelize_typescript_1.Model {
};
exports.Country = Country;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Country.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Country.prototype, "phoneCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Country.prototype, "flag", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Country.prototype, "currency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Country.prototype, "phoneLength", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Country.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Country.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], Country.prototype, "deletedAt", void 0);
exports.Country = Country = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'countries',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['deletedAt', 'createdAt', 'updatedAt'],
            },
        },
    })
], Country);
//# sourceMappingURL=country.entity.js.map