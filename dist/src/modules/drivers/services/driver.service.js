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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const driver_repository_1 = require("../repositories/driver.repository");
const client_device_service_1 = require("../../client-devices/services/client-device.service");
let DriverService = class DriverService {
    driverRepository;
    clientDeviceService;
    constructor(driverRepository, clientDeviceService) {
        this.driverRepository = driverRepository;
        this.clientDeviceService = clientDeviceService;
    }
    async addDriverLicense(userId, reqBody) {
        try {
            const driver = await this.driverRepository.update(userId, {
                licenseImageUrl: reqBody.licenseImageUrl,
            });
            if (!driver) {
                throw new common_1.NotFoundException('Driver not found!');
            }
            return reqBody;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateBankAccount(userId, reqBody) {
        try {
            const driver = await this.driverRepository.update(userId, {
                accountName: reqBody.accountName,
                accountNo: reqBody.accountNo,
                bankName: reqBody.bankName,
                bankCode: reqBody.bankCode,
            });
            if (!driver) {
                throw new common_1.NotFoundException('Driver not found!');
            }
            return reqBody;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async setDriverType(userId, isPeppcruiseDriver) {
        const driver = await this.driverRepository.update(userId, { isPeppcruiseDriver });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found!');
        }
        return driver;
    }
    async dashboard(data, userId) {
        try {
            const { deviceFCMToken, ipAddress, name } = data;
            const user = await this.driverRepository.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            const clientDevice = await this.clientDeviceService.findByDriverIdAndDeviceToken(userId, deviceFCMToken);
            if (clientDevice == null) {
                await this.clientDeviceService.registerDevice({
                    driverId: userId,
                    deviceFCMToken: deviceFCMToken,
                    ipAddress: ipAddress,
                    name: name,
                    userType: user.userType
                });
            }
            else {
                await this.clientDeviceService.updateDeviceToken(clientDevice.id, deviceFCMToken);
            }
            const dashboardRes = {
                fullName: user.fullName,
                email: user.email,
                phoneNo: user.phoneNo,
                userId: user.id
            };
            return dashboardRes;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async fetchDriver(id) {
        const driver = await this.driverRepository.fetchDriver(id);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found!');
        }
        return driver;
    }
    async findById(id) {
        return await this.driverRepository.findById(id);
    }
    async findByIdentity(identity) {
        return await this.driverRepository.findByIdentity(identity);
    }
    async findByEmail(email) {
        return await this.driverRepository.findByEmail(email);
    }
    async findAll(options) {
        return await this.driverRepository.findAll(options);
    }
    async update(id, driverData) {
        return await this.driverRepository.update(id, driverData);
    }
    async delete(id) {
        return await this.driverRepository.delete(id);
    }
    async restore(id) {
        return await this.driverRepository.restore(id);
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [driver_repository_1.DriverRepository,
        client_device_service_1.ClientDeviceService])
], DriverService);
//# sourceMappingURL=driver.service.js.map