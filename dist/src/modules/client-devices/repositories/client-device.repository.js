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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDeviceRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const client_device_entity_1 = require("../entities/client-device.entity");
let ClientDeviceRepository = class ClientDeviceRepository {
    clientDeviceModel;
    constructor(clientDeviceModel) {
        this.clientDeviceModel = clientDeviceModel;
    }
    async findById(id) {
        return await this.clientDeviceModel.findByPk(id);
    }
    async findByUserId(userId) {
        return await this.clientDeviceModel.findAll({
            where: { userId },
        });
    }
    async findByIpAddress(ipAddress) {
        return await this.clientDeviceModel.findAll({
            where: { ipAddress },
        });
    }
    async findByDeviceToken(deviceFCMToken) {
        return await this.clientDeviceModel.findOne({
            where: { deviceFCMToken },
        });
    }
    async findAll(options) {
        return await this.clientDeviceModel.findAll(options);
    }
    async findByUserIdAndDeviceToken(userId, deviceFCMToken) {
        const data = await this.clientDeviceModel.findOne({
            where: { userId, deviceFCMToken },
        });
        return data ? data.toJSON() : null;
    }
    async create(clientDeviceData) {
        return await this.clientDeviceModel.create(clientDeviceData);
    }
    async update(id, clientDeviceData) {
        return await this.clientDeviceModel.update(clientDeviceData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.clientDeviceModel.destroy({
            where: { id },
        });
    }
    async restore(id) {
        await this.clientDeviceModel.restore({
            where: { id },
        });
    }
    async findByUserAndDevice(userId, deviceFCMToken) {
        return await this.clientDeviceModel.findOne({
            where: {
                userId,
                deviceFCMToken,
            },
        });
    }
    async findByDriverAndDevice(driverId, deviceFCMToken) {
        return await this.clientDeviceModel.findOne({
            where: {
                driverId,
                deviceFCMToken,
            },
        });
    }
    async updateOrCreateDevice(deviceData) {
        const { userId, driverId, deviceFCMToken, ipAddress } = deviceData;
        if (!deviceFCMToken || !ipAddress) {
            throw new Error('deviceFCMToken and ipAddress are required');
        }
        if (!userId && !driverId) {
            throw new Error('Either userId or driverId must be provided');
        }
        const existingDevice = userId
            ? await this.findByUserAndDevice(userId, deviceFCMToken)
            : await this.findByDriverAndDevice(driverId, deviceFCMToken);
        if (existingDevice) {
            await this.update(existingDevice.id, deviceData);
            const data = await this.clientDeviceModel.findOne({
                where: { id: existingDevice.id }
            });
            if (data != null)
                return data;
            return existingDevice;
        }
        else {
            return await this.create(deviceData);
        }
    }
};
exports.ClientDeviceRepository = ClientDeviceRepository;
exports.ClientDeviceRepository = ClientDeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(client_device_entity_1.ClientDevice)),
    __metadata("design:paramtypes", [Object])
], ClientDeviceRepository);
//# sourceMappingURL=client-device.repository.js.map