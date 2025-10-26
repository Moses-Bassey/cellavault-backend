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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const token_entity_1 = require("../entities/token.entity");
const sequelize_2 = require("sequelize");
let TokenRepository = class TokenRepository {
    tokenModel;
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    async create(tokenData) {
        const token = await this.tokenModel.create(tokenData, { raw: true, returning: true });
        return token.toJSON();
    }
    async findByToken(token) {
        return await this.tokenModel.findOne({
            where: { token },
            attributes: ['id', 'expiry', 'email'],
            raw: true
        });
    }
    async findByPhoneOrEmailToken(token, phoneNo, email) {
        return await this.tokenModel.findOne({
            where: { [sequelize_2.Op.or]: [
                    { email: email },
                    { phoneNo: phoneNo },
                    { token: token }
                ], },
            attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
            raw: true
        });
    }
    async findByEmailToken(token, email) {
        return await this.tokenModel.findOne({
            where: { email, token },
            attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
            raw: true
        });
    }
    async findByTokenEmailAndSubject(token, email, subject) {
        return await this.tokenModel.findOne({
            where: { email, token, subject },
            attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
            raw: true
        });
    }
    async findByPhoneToken(token, phoneNo) {
        return await this.tokenModel.findOne({
            where: { phoneNo, token },
            attributes: ['id', 'expiry', 'email', 'phoneNo', 'token'],
            raw: true
        });
    }
    async delete(id) {
        return await this.tokenModel.destroy({
            where: { id },
        });
    }
    async deleteByToken(token) {
        return await this.tokenModel.destroy({
            where: { token },
        });
    }
};
exports.TokenRepository = TokenRepository;
exports.TokenRepository = TokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(token_entity_1.Token)),
    __metadata("design:paramtypes", [Object])
], TokenRepository);
//# sourceMappingURL=token.repository.js.map