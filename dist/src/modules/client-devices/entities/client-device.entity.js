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
exports.ClientDevice = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../../users/entities/user.entity");
const driver_entity_1 = require("../../drivers/entities/driver.entity");
const admin_entity_1 = require("../../admins/entities/admin.entity");
const enums_1 = require("../../../enums");
let ClientDevice = class ClientDevice extends sequelize_typescript_1.Model {
};
exports.ClientDevice = ClientDevice;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ClientDevice.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClientDevice.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ClientDevice.prototype, "deviceFCMToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ClientDevice.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_entity_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ClientDevice.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => driver_entity_1.Driver),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ClientDevice.prototype, "driverId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => admin_entity_1.Admin),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ClientDevice.prototype, "adminId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('DRIVER', 'USER', 'SUPER_ADMIN', 'PEPP_ADMIN', 'PEPP_MANAGER'),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ClientDevice.prototype, "userType", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ClientDevice.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => driver_entity_1.Driver),
    __metadata("design:type", driver_entity_1.Driver)
], ClientDevice.prototype, "driver", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => admin_entity_1.Admin),
    __metadata("design:type", admin_entity_1.Admin)
], ClientDevice.prototype, "admin", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], ClientDevice.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], ClientDevice.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Object)
], ClientDevice.prototype, "deletedAt", void 0);
exports.ClientDevice = ClientDevice = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'client_devices',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['deletedAt'],
            },
        },
    })
], ClientDevice);
//# sourceMappingURL=client-device.entity.js.map