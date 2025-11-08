"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSubject = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["OTP"] = "OTP";
    TokenType["JWT"] = "JWT";
    TokenType["REFRESH"] = "REFRESH";
})(TokenType || (exports.TokenType = TokenType = {}));
var TokenSubject;
(function (TokenSubject) {
    TokenSubject["FORGOT_PASSWORD"] = "PASSWORD_RESET";
    TokenSubject["SIGN_UP_PHONE"] = "SIGN_UP_PHONE";
    TokenSubject["SIGN_UP_EMAIL"] = "SIGN_UP_EMAIL";
    TokenSubject["NEW_DEVICE_LOGIN_OTP"] = "NEW_DEVICE_LOGIN_OTP";
    TokenSubject["RESET_PASSCODE"] = "RESET_PASSCODE";
})(TokenSubject || (exports.TokenSubject = TokenSubject = {}));
//# sourceMappingURL=token.enum.js.map