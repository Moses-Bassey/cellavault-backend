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
exports.ClientDeviceService = void 0;
const common_1 = require("@nestjs/common");
const client_device_repository_1 = require("../repositories/client-device.repository");
let ClientDeviceService = class ClientDeviceService {
    clientDeviceRepository;
    constructor(clientDeviceRepository) {
        this.clientDeviceRepository = clientDeviceRepository;
    }
    async findById(id) {
        return await this.clientDeviceRepository.findById(id);
    }
    async findByUserId(userId) {
        const devices = await this.clientDeviceRepository.findByUserId(userId);
        return devices;
    }
    async findByIpAddress(ipAddress) {
        const devices = await this.clientDeviceRepository.findByIpAddress(ipAddress);
        return devices;
    }
    async findByUserIdAndDeviceToken(userId, deviceFCMToken) {
        return await this.clientDeviceRepository.findByUserIdAndDeviceToken(userId, deviceFCMToken);
    }
    async findAll(options) {
        const devices = await this.clientDeviceRepository.findAll(options);
        return devices;
    }
    async create(clientDeviceData) {
        return await this.clientDeviceRepository.create(clientDeviceData);
    }
    async update(id, clientDeviceData) {
        return await this.clientDeviceRepository.update(id, clientDeviceData);
    }
    async delete(id) {
        return await this.clientDeviceRepository.delete(id);
    }
    async restore(id) {
        await this.clientDeviceRepository.restore(id);
    }
    async registerDevice(deviceData) {
        const device = await this.clientDeviceRepository.updateOrCreateDevice(deviceData);
        return device;
    }
    async updateDeviceToken(deviceId, deviceFCMToken) {
        const [affectedCount, updatedDevices] = await this.clientDeviceRepository.update(deviceId, {
            deviceFCMToken,
        });
        if (affectedCount === 0) {
            throw new common_1.NotFoundException('Device not found!');
        }
        return updatedDevices[0];
    }
};
exports.ClientDeviceService = ClientDeviceService;
exports.ClientDeviceService = ClientDeviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_device_repository_1.ClientDeviceRepository])
], ClientDeviceService);
//# sourceMappingURL=client-device.service.js.map