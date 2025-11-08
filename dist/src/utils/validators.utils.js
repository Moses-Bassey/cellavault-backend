"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
class Validators {
    static validateEmail(email) {
        if (!email) {
            throw new common_1.BadGatewayException('Invalid email provided');
        }
        email = email.toLowerCase();
        const invalidEmailDomains = ['mailinator.com'];
        const emailDomain = email.split("@")[1];
        invalidEmailDomains.forEach(domain => {
            if (domain == emailDomain) {
                throw new common_1.BadRequestException('Invalid email domain');
            }
        });
        return email;
    }
    static getLoginIdentity(identity) {
        if (!identity) {
            throw new common_1.BadRequestException("Invalid identity");
        }
        if (identity.includes("@")) {
            return enums_1.UserLoginIdentityType.EMAIL;
        }
        return enums_1.UserLoginIdentityType.PHONE_NO;
    }
    static validateUuid(value) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
            throw new common_1.BadRequestException('Invalid UUID format');
        }
        return value;
    }
}
exports.Validators = Validators;
//# sourceMappingURL=validators.utils.js.map