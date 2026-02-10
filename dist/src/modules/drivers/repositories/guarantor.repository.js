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
exports.GuarantorRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const guarantor_entity_1 = require("../entities/guarantor.entity");
let GuarantorRepository = class GuarantorRepository {
    guarantorModel;
    constructor(guarantorModel) {
        this.guarantorModel = guarantorModel;
    }
    async findById(id) {
        return await this.guarantorModel.findByPk(id, { raw: true });
    }
    async findByDriverId(driverId) {
        return await this.guarantorModel.findAll({
            where: { driverId },
            raw: true,
        });
    }
    async countByDriverId(driverId) {
        return await this.guarantorModel.count({
            where: { driverId },
        });
    }
    async create(guarantorData) {
        const guarantor = await this.guarantorModel.create(guarantorData, {
            raw: true,
            returning: true,
        });
        return guarantor.toJSON();
    }
    async update(id, guarantorData) {
        return await this.guarantorModel.update(guarantorData, {
            where: { id },
            returning: true,
        });
    }
    async delete(id) {
        return await this.guarantorModel.destroy({
            where: { id },
        });
    }
    async deleteGuarantor(id, driverId) {
        return await this.guarantorModel.destroy({
            where: { id, driverId },
        });
    }
    async deleteByDriverId(driverId) {
        return await this.guarantorModel.destroy({
            where: { driverId },
        });
    }
};
exports.GuarantorRepository = GuarantorRepository;
exports.GuarantorRepository = GuarantorRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(guarantor_entity_1.Guarantor)),
    __metadata("design:paramtypes", [Object])
], GuarantorRepository);
//# sourceMappingURL=guarantor.repository.js.map