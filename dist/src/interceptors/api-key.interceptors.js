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
exports.ApiKeyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ApiKeyInterceptor = class ApiKeyInterceptor {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async validateAPIKey(apikey) {
        const validApiKey = this.configService.get('app.apiKey');
        if (apikey === validApiKey) {
            return true;
        }
        throw new common_1.BadRequestException('Invalid API product key');
    }
    async resolveAPIKey(request) {
        const errorMessage = 'No x-product-key header';
        const productKey = request.headers['x-product-key'];
        if (!productKey)
            throw new common_1.BadRequestException(errorMessage);
        return await this.validateAPIKey(productKey);
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const path = request.url;
        if (path !== '/') {
            const errorMessage = 'No x-product-key header';
            const productKey = request.headers['x-product-key'];
            if (!productKey) {
                throw new common_1.BadRequestException(errorMessage);
            }
            await this.validateAPIKey(productKey);
        }
        return next.handle().pipe();
    }
};
exports.ApiKeyInterceptor = ApiKeyInterceptor;
exports.ApiKeyInterceptor = ApiKeyInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ApiKeyInterceptor);
//# sourceMappingURL=api-key.interceptors.js.map