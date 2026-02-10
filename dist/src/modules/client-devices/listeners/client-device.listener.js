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
exports.ClientDeviceListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const client_device_service_1 = require("../services/client-device.service");
let ClientDeviceListener = class ClientDeviceListener {
    clientDeviceService;
    constructor(clientDeviceService) {
        this.clientDeviceService = clientDeviceService;
    }
    async handleAddDeviceToken(payload) {
        try {
            await this.clientDeviceService.create({
                adminId: payload.adminId || null,
                userId: payload.userId || null,
                driverId: payload.driverId || null,
                ipAddress: payload.ipAddress,
                deviceFCMToken: payload.deviceFCMToken || null,
                name: payload.name || null,
                userType: payload.userType || undefined,
            });
        }
        catch (error) {
            console.error('Failed to save client device token', error);
        }
    }
};
exports.ClientDeviceListener = ClientDeviceListener;
__decorate([
    (0, event_emitter_1.OnEvent)('addDeviceToken'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientDeviceListener.prototype, "handleAddDeviceToken", null);
exports.ClientDeviceListener = ClientDeviceListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_device_service_1.ClientDeviceService])
], ClientDeviceListener);
//# sourceMappingURL=client-device.listener.js.map