"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyClientDevice = VerifyClientDevice;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_device_guard_1 = require("../guards/client-device.guard");
function VerifyClientDevice() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(client_device_guard_1.ClientDeviceGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiHeader)({
        name: 'x-client-device-token',
        description: 'Client device token for verification',
        required: true,
    }));
}
//# sourceMappingURL=verify-client-device.decorator.js.map