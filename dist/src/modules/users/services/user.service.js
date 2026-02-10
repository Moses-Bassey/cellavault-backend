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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_repository_1 = require("../repositories/user.repository");
const client_device_service_1 = require("../../client-devices/services/client-device.service");
let UserService = class UserService {
    userRepository;
    clientDeviceService;
    configService;
    constructor(userRepository, clientDeviceService, configService) {
        this.userRepository = userRepository;
        this.clientDeviceService = clientDeviceService;
        this.configService = configService;
    }
    async fetchUser(id) {
        try {
            const user = await this.userRepository.fetchUser(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            return user;
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found!');
        }
    }
    async dashboard(data, userId) {
        try {
            const { deviceFCMToken, ipAddress, name } = data;
            const user = await this.userRepository.fetchUser(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(userId, deviceFCMToken);
            if (clientDevice == null) {
                await this.clientDeviceService.registerDevice({
                    userId: userId,
                    deviceFCMToken: deviceFCMToken,
                    ipAddress: ipAddress,
                    name: name,
                    userType: user.userType,
                });
            }
            else {
                await this.clientDeviceService.updateDeviceToken(clientDevice.id, deviceFCMToken);
            }
            const dashboardRes = {
                fullName: user.fullName,
                email: user.email,
                phoneNo: user.phoneNo,
                userId: user.id,
            };
            return dashboardRes;
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found!');
        }
    }
    async findAll(options) {
        return await this.userRepository.findAll(options);
    }
    async countFiltered(options) {
        return this.userRepository.countFiltered(options);
    }
    async update(id, userData) {
        return await this.userRepository.update(id, userData);
    }
    async delete(id) {
        return await this.userRepository.delete(id);
    }
    async restore(id) {
        await this.userRepository.restore(id);
    }
    async countActiveUsers() {
        const isDisabled = false;
        const users = await this.userRepository.findActiveUsers(isDisabled);
        return users?.length ?? null;
    }
    async countAllUsers() {
        const users = await this.userRepository.countAll();
        return users?.length ?? null;
    }
    async countBannedUsers() {
        const isDisabled = true;
        const users = await this.userRepository.findAllBanned(isDisabled);
        return users?.length ?? null;
    }
    async getNewUsersForMonth() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentMonthUsers = await this.userRepository.getNewUsersForMonth(currentYear, currentMonth);
        return currentMonthUsers?.length ?? null;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        client_device_service_1.ClientDeviceService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map