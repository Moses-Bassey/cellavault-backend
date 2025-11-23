"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monifyAPI = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const BasicAuth = Buffer.from(`${process.env.MONIFY_API_KEY}:${process.env.MONIFY_API_SECRET}`).toString('base64');
const monifyAPIRequest = axios_1.default.create({
    baseURL: process.env.MONIFY_API_BASE_URL,
});
class monifyAPI {
    static async authenticate() {
        const errorMessage = 'could not carry out transaction please try again later';
        try {
            const { data } = await monifyAPIRequest.post('/v1/auth/login', null, {
                headers: {
                    Authorization: `Basic ${BasicAuth}`,
                },
            });
            if (!data || !data.responseBody || !data.responseBody.accessToken) {
                return Promise.reject(errorMessage);
            }
            return data.responseBody.accessToken;
        }
        catch (e) {
            return Promise.reject(errorMessage);
        }
    }
    static async fetchBanks() {
        const url = `${process.env.MONIFY_API_BASE_URL}/v1/banks`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.authenticate()}`,
        };
        try {
            const response = await axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    static async validateAccount({ bankCode, accountNumber }) {
        const errorMessage = 'Could not verify account';
        const url = `${process.env.MONIFY_API_BASE_URL}/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.authenticate()}`,
        };
        try {
            const response = await axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            console.log(error.data);
            return errorMessage;
        }
    }
}
exports.monifyAPI = monifyAPI;
//# sourceMappingURL=monnify.js.map