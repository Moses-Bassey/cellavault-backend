"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDevicesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const client_device_entity_1 = require("./entities/client-device.entity");
const client_device_controller_1 = require("./controllers/client-device.controller");
const client_device_service_1 = require("./services/client-device.service");
const client_device_repository_1 = require("./repositories/client-device.repository");
let ClientDevicesModule = class ClientDevicesModule {
};
exports.ClientDevicesModule = ClientDevicesModule;
exports.ClientDevicesModule = ClientDevicesModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([client_device_entity_1.ClientDevice])],
        controllers: [client_device_controller_1.ClientDeviceController],
        providers: [client_device_service_1.ClientDeviceService, client_device_repository_1.ClientDeviceRepository],
        exports: [client_device_service_1.ClientDeviceService, client_device_repository_1.ClientDeviceRepository],
    })
], ClientDevicesModule);
//# sourceMappingURL=client-devices.module.js.map