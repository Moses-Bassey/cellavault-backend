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
const response_utils_1 = require("../../../utils/response.utils");
let ClientDeviceService = class ClientDeviceService {
    clientDeviceRepository;
    constructor(clientDeviceRepository) {
        this.clientDeviceRepository = clientDeviceRepository;
    }
    async findById(id) {
        return await this.clientDeviceRepository.findById(id);
    }
    async findByUserId(userId) {
        try {
            const devices = await this.clientDeviceRepository.findByUserId(userId);
            return response_utils_1.ResponseUtil.success(devices, 'User devices retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred while retrieving user devices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIpAddress(ipAddress) {
        try {
            const devices = await this.clientDeviceRepository.findByIpAddress(ipAddress);
            return response_utils_1.ResponseUtil.success(devices, 'Devices by IP retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred while retrieving devices by IP', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByDeviceToken(deviceFCMToken) {
        return await this.clientDeviceRepository.findByDeviceToken(deviceFCMToken);
    }
    async findAll(options) {
        try {
            const devices = await this.clientDeviceRepository.findAll(options);
            return response_utils_1.ResponseUtil.success(devices, 'Client devices retrieved successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred during find all client devices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
        try {
            const device = await this.clientDeviceRepository.updateOrCreateDevice(deviceData);
            return response_utils_1.ResponseUtil.success(device, 'Device registered successfully', common_1.HttpStatus.CREATED);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred while registering device', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDeviceToken(deviceId, deviceFCMToken) {
        try {
            const [affectedCount, updatedDevices] = await this.clientDeviceRepository.update(deviceId, {
                deviceFCMToken,
            });
            if (affectedCount === 0) {
                throw new common_1.NotFoundException('Device not found!');
            }
            return response_utils_1.ResponseUtil.success(updatedDevices[0], 'Device token updated successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return response_utils_1.ResponseUtil.errorFromException(error, 'An error occurred while updating device token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientDeviceService = ClientDeviceService;
exports.ClientDeviceService = ClientDeviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_device_repository_1.ClientDeviceRepository])
], ClientDeviceService);
//# sourceMappingURL=client-device.service.js.map