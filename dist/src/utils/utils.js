"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
class Utils {
    static getLoginIdentityType(identity) {
        if (!identity) {
            throw new common_1.BadRequestException("Invalid identity");
        }
        if (identity.includes("@")) {
            return enums_1.UserLoginIdentityType.EMAIL;
        }
        return enums_1.UserLoginIdentityType.PHONE_NO;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map