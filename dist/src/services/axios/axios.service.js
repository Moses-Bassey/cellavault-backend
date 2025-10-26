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
exports.AxiosService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AxiosService = class AxiosService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async post(url, data, config) {
        try {
            const response = this.httpService.post(url, data, config);
            return await (0, rxjs_1.lastValueFrom)(response);
        }
        catch (error) {
            this.handleError(error, 'Error making POST request');
        }
    }
    async get(url, config) {
        try {
            const response = this.httpService.get(url, config);
            return await (0, rxjs_1.lastValueFrom)(response);
        }
        catch (error) {
            this.handleError(error, 'Error making GET request');
        }
    }
    handleError(error, defaultMessage) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error;
            throw new common_1.HttpException(axiosError.response?.data || defaultMessage, axiosError.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw new common_1.HttpException(defaultMessage, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.AxiosService = AxiosService;
exports.AxiosService = AxiosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AxiosService);
//# sourceMappingURL=axios.service.js.map