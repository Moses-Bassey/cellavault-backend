"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
const common_1 = require("@nestjs/common");
class ResponseUtil {
    static success(data, message = 'Request successful', statusCode) {
        return {
            status: 'success',
            statusCode,
            message,
            data,
        };
    }
    static error(message, error = '', statusCode) {
        return {
            status: 'error',
            message,
            error,
            statusCode,
        };
    }
    static errorFromException(error, defaultMessage = 'An error occurred', defaultStatusCode = 500) {
        const message = error instanceof Error ? error.message : defaultMessage;
        const statusCode = error &&
            typeof error === 'object' &&
            'status' in error &&
            typeof error.status === 'number'
            ? error.status
            : defaultStatusCode;
        return {
            status: 'error',
            message,
            statusCode,
        };
    }
    static handleResponse(data, message, statusCode = common_1.HttpStatus.OK) {
        return {
            status: 'success',
            statusCode,
            message,
            data,
        };
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.utils.js.map