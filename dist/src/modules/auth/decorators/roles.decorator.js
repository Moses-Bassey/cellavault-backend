"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.USERTYPES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.USERTYPES_KEY = 'userTypes';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.USERTYPES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map