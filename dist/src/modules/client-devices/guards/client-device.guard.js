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
exports.ClientDeviceGuard = void 0;
const common_1 = require("@nestjs/common");
const client_device_service_1 = require("../services/client-device.service");
let ClientDeviceGuard = class ClientDeviceGuard {
    clientDeviceService;
    constructor(clientDeviceService) {
        this.clientDeviceService = clientDeviceService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const clientDeviceToken = request.headers['x-client-device-token'];
        if (!clientDeviceToken) {
            throw new common_1.BadRequestException('x-client-device-token header is required');
        }
        const userId = request.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const clientDevice = await this.clientDeviceService.findByUserIdAndDeviceToken(userId, clientDeviceToken);
        if (!clientDevice) {
            throw new common_1.UnauthorizedException('Invalid client device token');
        }
        request.clientDevice = clientDevice;
        return true;
    }
};
exports.ClientDeviceGuard = ClientDeviceGuard;
exports.ClientDeviceGuard = ClientDeviceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_device_service_1.ClientDeviceService])
], ClientDeviceGuard);
//# sourceMappingURL=client-device.guard.js.map