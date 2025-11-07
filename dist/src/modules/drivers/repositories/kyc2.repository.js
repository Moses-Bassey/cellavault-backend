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
exports.Kyc2Repository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const kyc2_Id_Information_entity_1 = require("../entities/kyc2-Id-Information.entity");
let Kyc2Repository = class Kyc2Repository {
    kyc2Model;
    constructor(kyc2Model) {
        this.kyc2Model = kyc2Model;
    }
    async findById(id) {
        return await this.kyc2Model.findByPk(id, { raw: true });
    }
    async findByDriverId(driverId) {
        return await this.kyc2Model.findOne({
            where: { driverId },
            raw: true,
        });
    }
    async create(kycData) {
        const kyc = await this.kyc2Model.create(kycData, {
            raw: true,
            returning: true,
        });
        return kyc.toJSON();
    }
    async update(id, kycData) {
        return await this.kyc2Model.update(kycData, {
            where: { id },
            returning: true,
        });
    }
    async updateByDriverId(driverId, kycData) {
        return await this.kyc2Model.update(kycData, {
            where: { driverId },
            returning: true,
        });
    }
    async delete(id) {
        return await this.kyc2Model.destroy({
            where: { id },
        });
    }
    async deleteByDriverId(driverId) {
        return await this.kyc2Model.destroy({
            where: { driverId },
        });
    }
};
exports.Kyc2Repository = Kyc2Repository;
exports.Kyc2Repository = Kyc2Repository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(kyc2_Id_Information_entity_1.kyc2IdInformation)),
    __metadata("design:paramtypes", [Object])
], Kyc2Repository);
//# sourceMappingURL=kyc2.repository.js.map