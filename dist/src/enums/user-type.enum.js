"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginIdentityType = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserType["PEPP_ADMIN"] = "PEPP_ADMIN";
    UserType["PEPP_MANAGER"] = "PEPP_MANAGER";
    UserType["USER"] = "USER";
    UserType["DRIVER"] = "DRIVER";
})(UserType || (exports.UserType = UserType = {}));
var UserLoginIdentityType;
(function (UserLoginIdentityType) {
    UserLoginIdentityType["PHONE_NO"] = "PHONE_NO";
    UserLoginIdentityType["EMAIL"] = "EMAIL";
})(UserLoginIdentityType || (exports.UserLoginIdentityType = UserLoginIdentityType = {}));
//# sourceMappingURL=user-type.enum.js.map