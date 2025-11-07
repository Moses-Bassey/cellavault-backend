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
exports.Kyc3Repository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const kyc3_residential_Information_entity_1 = require("../entities/kyc3-residential-Information.entity");
let Kyc3Repository = class Kyc3Repository {
    kyc3Model;
    constructor(kyc3Model) {
        this.kyc3Model = kyc3Model;
    }
    async findById(id) {
        return await this.kyc3Model.findByPk(id, { raw: true });
    }
    async findByDriverId(driverId) {
        return await this.kyc3Model.findOne({
            where: { driverId },
            raw: true,
        });
    }
    async create(kycData) {
        const kyc = await this.kyc3Model.create(kycData, {
            raw: true,
            returning: true,
        });
        return kyc.toJSON();
    }
    async update(id, kycData) {
        return await this.kyc3Model.update(kycData, {
            where: { id },
            returning: true,
        });
    }
    async updateByDriverId(driverId, kycData) {
        return await this.kyc3Model.update(kycData, {
            where: { driverId },
            returning: true,
        });
    }
    async delete(id) {
        return await this.kyc3Model.destroy({
            where: { id },
        });
    }
    async deleteByDriverId(driverId) {
        return await this.kyc3Model.destroy({
            where: { driverId },
        });
    }
};
exports.Kyc3Repository = Kyc3Repository;
exports.Kyc3Repository = Kyc3Repository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(kyc3_residential_Information_entity_1.kyc3ResidentialInformation)),
    __metadata("design:paramtypes", [Object])
], Kyc3Repository);
//# sourceMappingURL=kyc3.repository.js.map