"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
class Utils {
    static getLoginIdentityType(identity) {
        if (!identity) {
            throw new common_1.BadRequestException('Invalid identity');
        }
        if (identity.includes('@')) {
            return enums_1.UserLoginIdentityType.EMAIL;
        }
        return enums_1.UserLoginIdentityType.PHONE_NO;
    }
    static normalizeCountryPhone(countryCode, phoneNo, phoneNoLength) {
        const normalizedCountryCode = countryCode.startsWith('+')
            ? countryCode.slice(1)
            : countryCode;
        let normalizedPhoneNo = phoneNo;
        if (normalizedPhoneNo.startsWith(normalizedCountryCode)) {
            normalizedPhoneNo = normalizedPhoneNo.slice(normalizedCountryCode.length);
        }
        const normalizedFullPhoneNo = normalizedCountryCode + normalizedPhoneNo;
        if (phoneNo.length === phoneNoLength) {
            return normalizedFullPhoneNo;
        }
        throw new common_1.BadRequestException('Invalid phone number');
    }
    static phoneSMSFormat(phone) {
        if (!phone) {
            throw new common_1.BadRequestException('Invalid phone number');
        }
        return '+' + phone;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map